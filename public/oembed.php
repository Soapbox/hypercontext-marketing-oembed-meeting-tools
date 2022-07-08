<?php


if(isset($_GET['url'])){
    $url = $_GET['url'];
} else {
    $url = '';
}


if(
    strlen($url) 
    && 
    (
        (strpos( $url , "https://hypercontext.com/embeds/countdown.html" ) === 0)
        ||
        (strpos( $url , "https://hypercontext.com/embeds/wheel-of-random.php" ) === 0)
    )
){

    $url = (htmlspecialchars($url));

    $width = '100%';
    $height = '100%';

    $maxwidth = 720;
    $maxheight = 450;

    // if(isset($_GET['maxwidth']) && is_numeric($_GET['maxwidth'])){
    //     $maxwidth = $_GET['maxwidth'];
    // }
    // if(isset($_GET['maxheight']) && is_numeric($_GET['maxheight'])){
    //     $maxheight = $_GET['maxheight'];
    // }

    $response = array(
        "version" => "1.0",
        "type" => "rich",
     
        "provider_name" => "Hypercontext",
        "provider_url" => "https://hypercontext.com",
     
         "html" => "<iframe style='width:".$width.";height:".$height.";max-width:".$maxwidth."px;max-height:".$maxheight."px;aspect-ratio: ".$maxwidth." / ".$maxheight.";' width='".$maxwidth."' height='".$maxheight."' border='0' loading='lazy' allowfullscreen='true' scrolling='no' frameborder='0' src='".$url."' title='Free Meeting Tools- Hypercontext.com'></iframe>",
         "width" => $maxwidth,
         "height" => $maxheight,

         "referrer" => "",
         "cache_age" => 3600
    );

    echo json_encode($response);

} else {

    echo 'no';

}

