<?php
// on recupere les images du dossier images
$images = glob('images/*.{jpg,png,gif}', GLOB_BRACE);


class employe
{

    public $prenom;
    public $cheminImage;

    public function __construct($prenom)
    {
        $this->prenom = $prenom;
        $this->cheminImage = "images/" . $prenom . ".png";
    }
}

class bureau
{

    public $numero;
    public $tableau;
    public $tableauHTML;
    public $places;

    public function __construct($numero, $places)
    {
        $this->tableau = [];
        for ($i = 0; $i < $places; $i++) {
            $this->tableau[$i] = "";
        }

        $this->numero = $numero;
        $this->tableauHTML = "<table class='table table-bordered'>";
        for ($i = 0; $i < 2; $i++) {
            $this->tableauHTML .= "<tr>";
            for ($j = 0; $j < $places / 2; $j++) {
                $this->tableauHTML .= "<td>" . $j . "</td>";
            }
            $this->tableauHTML .= "</tr>";
        }
        $this->tableauHTML .= "</table>";
    }

    public function randomPlaceEmploye($employe)
    {
        $placesLibres = [];
        for ($i = 0; $i < count($this->tableau); $i++) {
            if ($this->tableau[$i] == "") {
                $placesLibres[] = $i;
            }
        }
        $place = $placesLibres[rand(0, count($placesLibres) - 1)];
        $this->tableau[$place] = $employe->prenom;
        $this->numero = $place;
    }
}

// on cree les bureaux
$bureaux = [new bureau(1, 6), new bureau(2, 6), new bureau(3, 6), new bureau(4, 8)];


// on cree les employes
// recuperation des photos
$images = glob('images/*.png', GLOB_BRACE);

// on recupere les prenoms des photos
$employes = [];
foreach ($images as $image) {
    $employes[] = new employe(basename($image, ".png"));
}


// attribution des places
foreach ($bureaux as $bureau) {
    for ($i = 0; $i < count($employes); $i++) {
        $bureau->randomPlaceEmploye($employes[$i]);
    }
}




?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <title>Plan de table DELTIC</title>
</head>

<body>

    <div class="container">


        <h1>Plan de table</h1>



        <table class="table table">
            <tr>
                <td>
                    <?php echo $bureaux[0]->tableauHTML;; ?>
                </td>
                <td></td>

            </tr>
            <tr>
                <td>
                    <?php echo $bureaux[1]->tableauHTML;; ?>
                </td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <?php echo $bureaux[2]->tableauHTML;; ?>
                </td>
                <td>
                    <?php echo $bureaux[3]->tableauHTML;; ?>
                </td>
            </tr>
        </table>












    </div>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous">
    </script>
</body>

</html>