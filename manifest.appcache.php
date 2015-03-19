<?php

header('Content-Type: text/cache-manifest');

$bdd = "appcache.bdd";
$directory_file_path = '.';
$files = array();


$database = new SQLite3($bdd, 0666);
if (!$database) {
    $error = (file_exists($bdd)) ? "Impossible to open, check permissions" : "Impossible to create, check permissions";
    die($error);
}


/* cration tables */
$query = "CREATE TABLE IF NOT EXISTS files (
            sha VARCHAR(255) NOT NULL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
          )";
$database->exec($query);

$query = "CREATE TABLE IF NOT EXISTS appcache (
            manifest longtext
          )";
$database->exec($query);



$flag_diff = false;
$resource = opendir($directory_file_path) or die('Erreur');
while($entry = @readdir($resource)) {
  if($entry != '.' && $entry != '..'
    && $entry != 'manifest.appcache.php' && $entry != 'appcache.bdd'
    && !is_dir($directory_file_path.'/'.$entry) ) {

    $fileHandle = fopen($directory_file_path.'/'.$entry, "rb");
    $fileContents = stream_get_contents($fileHandle);
    fclose($fileHandle);

    $sha_fileContents = sha1($fileContents);
    $files[] = $entry;

    $query = "SELECT sha FROM files WHERE name = '$entry';";
    $results = $database->query($query);
    $row = $results->fetchArray();
    if(false === $row) {
      $query = "INSERT INTO files(name, sha) VALUES ('$entry', '$sha_fileContents')";
      $database->exec($query);
      $flag_diff = true;
    }
    else {
      if($row['sha'] !== $sha_fileContents) {
        $query = "UPDATE files SET sha = '$sha_fileContents' WHERE sha='{$row['sha']}'";
        $database->exec($query);
        $flag_diff = true;
      }
    }
  }
}
closedir($resource);

$query = "SELECT name FROM files;";
$results = $database->query($query);
while($row = $results->fetchArray()) {
  if(false === in_array($row['name'], $files)) {
    $database->exec("DELETE FROM files WHERE name='{$row['name']}'");
    $flag_diff = true;
  }
}


if(true === $flag_diff) {
  $query = "SELECT name, sha FROM files;";
  $results = $database->query($query);

  if (!$results)
    die("Impossible to execute query.");

  $manifest = "CACHE MANIFEST\r\n\r\n";
  $file_names = "";
  $version = "";

  while ($row = $results->fetchArray()) {
    $file_names .= $row['name']."\r\n";
    $version .= $row['sha'];
  }

   $manifest .= "# Version $version

CACHE:
$file_names

NETWORK:
*
";

  // echo $manifest;
  $query = "SELECT manifest FROM appcache;";
  $results = $database->query($query);
  $row = $results->fetchArray();
  if(false === $row) {
    $query = "INSERT INTO appcache(manifest) VALUES ('$manifest');";
  }
  else {
    $query = "UPDATE appcache SET manifest = '$manifest';";
  }
  $database->exec($query);
}


$query = "SELECT manifest FROM appcache;";
$results = $database->query($query);
$row = $results->fetchArray();
echo $row['manifest'];
