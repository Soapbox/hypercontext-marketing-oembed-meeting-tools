<?php
$url =  "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
$escaped_url = htmlspecialchars( $url );

$title = array();
$days = isset($_GET['days']) ? intval($_GET['days']) : 0;
$hours = isset($_GET['hours']) ? intval($_GET['hours']) : 0;
$minutes = isset($_GET['minutes']) ? intval($_GET['minutes']) : 10;
$seconds = isset($_GET['seconds']) ? intval($_GET['seconds']) : 0;

if( $days ) {
    $title[] = $days . ' day';
}
if( $hours ) {
    $title[] = $hours . ' hour';
}
if( $minutes ) {
    $title[] = $minutes . ' minute';
}
if( $seconds ) {
    $title[] = $seconds . ' second';
}

$title = implode(", ", $title);


$title = $title." Meeting Timer";

?>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="googlebot" content="noindex,indexifembedded" />
  <title><?php echo $title;?> - Free Meeting Tools - Hypercontext.com</title>
  <link rel="alternate" type="application/json+oembed"
    href="http://hypercontext.com/embeds/oembed.php?url=<?php echo ($escaped_url);?>&format=json"
    title="<?php echo $title;?>" />
  <script type="text/javascript" src="bundle-index.js"></script>
</head>
<body class="w-full h-full bg-slate-200">
    <div class="absolute top-0 left-0 right-0 h-4">
        <!-- header -->
        <button aria-label="Toggle Fullscreen" class="z-10 absolute right-1 top-1 p-1 xs:p-2 rounded-md transition-all border border-transparent hover:border-gray-400 hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none" onclick="if (!document.fullscreenElement) {document.documentElement.requestFullscreen();} else {if (document.exitFullscreen) {document.exitFullscreen();}}">
            <svg class="xs:w-6 w-4 xs:h-6 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M12 5.5L10 8H14L12 5.5M18 10V14L20.5 12L18 10M6 10L3.5 12L6 14V10M14 16H10L12 18.5L14 16M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3M21 19H3V5H21V19Z"/></svg>
        </button>
    </div>
    <div class="absolute top-4 left-0 bottom-4 right-0 flex flex-col items-center justify-start xs:justify-center">
        <div class="timer-text font-semibold align-middle text-[24vw] ">
            <span class="days">
                <span class="units relative after:content-['Days'] after:absolute after:right-0 after:-bottom-1 xs:after:bottom-0 after:left-0 after:text-xs xs:after:text-sm after:text-center">0</span>
                <span class="meta relative -top-3 -mx-[4vw] font-light opacity-60 transition-opacity">:</span>
            </span>
            <span class="hours">
                <span class="units relative after:content-['Hours'] after:absolute after:right-0 after:-bottom-1 xs:after:bottom-0 after:left-0 after:text-xs xs:after:text-sm after:text-center">0</span>
                <span class="meta relative -top-3 -mx-[4vw] font-light opacity-60 transition-opacity">:</span>
            </span>
            <span class="minutes ">
                <span class="units relative after:content-['Minutes'] after:absolute after:right-0 after:-bottom-1 xs:after:bottom-0 after:left-0 after:text-xs xs:after:text-sm after:text-center">0</span>
                <span class="meta relative -top-3 -mx-[4vw] font-light opacity-60 transition-opacity">:</span>
            </span>
            <span class="seconds relative">
                <span class="units after:content-['Seconds'] after:absolute after:right-0 after:-bottom-1 xs:after:bottom-0 after:left-0 after:text-xs xs:after:text-sm after:text-center">0</span>
                <span class="meta relative -top-3 font-light opacity-60 transition-opacity"></span>
            </span>
        </div>
    </div>
    <div class="absolute sm:bottom-6 xs:bottom-4 xxs:bottom-2 xxxs:bottom-0.5 bottom-0 w-full text-center">
        <!-- footer -->
        <div tabindex="0" role="button" aria-label="Start/Stop the timer" tabindex="0" class="inline-block mx-1 p-1 sm:p-2 border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none" onclick="view.actions.playOrPause()">
            <svg class="xs:w-6 w-4 xs:h-6 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M3,5V19L11,12M13,19H16V5H13M18,5V19H21V5"/></svg>
        </div> 
        <div tabindex="0" role="button" aria-label="Reset the Timer" tabindex="0" class="inline-block mx-1  p-1 sm:p-2 border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none" onclick="view.actions.reset();">
            <svg class="xs:w-6 w-4 xs:h-6 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z"/></svg>
        </div>
        <div tabindex="0" role="button" aria-label="Change Settings of Timer" class="inline-block group mx-1">
            <div class="peer  p-1 sm:p-2 border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                <svg class="xs:w-6 w-4 xs:h-6 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M22.8 19.4C22.9 19.4 22.9 19.5 22.8 19.6L21.8 21.3C21.7 21.4 21.6 21.4 21.5 21.4L20.3 21C20 21.2 19.8 21.3 19.5 21.5L19.3 22.8C19.3 22.9 19.2 23 19.1 23H17.1C17 23 16.9 22.9 16.8 22.8L16.6 21.5C16.3 21.4 16 21.2 15.8 21L14.6 21.5C14.5 21.5 14.4 21.5 14.3 21.4L13.3 19.7C13.2 19.6 13.3 19.5 13.4 19.4L14.5 18.6V17.6L13.4 16.8C13.3 16.7 13.3 16.6 13.3 16.5L14.3 14.8C14.4 14.7 14.5 14.7 14.6 14.7L15.8 15.2C16.1 15 16.3 14.9 16.6 14.7L16.8 13.4C16.8 13.3 16.9 13.2 17.1 13.2H19.1C19.2 13.2 19.3 13.3 19.3 13.4L19.5 14.7C19.8 14.8 20.1 15 20.4 15.2L21.6 14.7C21.7 14.7 21.9 14.7 21.9 14.8L22.9 16.5C23 16.6 22.9 16.7 22.8 16.8L21.7 17.6V18.6L22.8 19.4M19.5 18C19.5 17.2 18.8 16.5 18 16.5S16.5 17.2 16.5 18 17.2 19.5 18 19.5 19.5 18.8 19.5 18M13 14V8H11V14M15 1H9V3H15V1M11.3 20C7.8 19.6 5 16.6 5 13C5 9.1 8.1 6 12 6C15.2 6 17.9 8.1 18.7 11C19.5 11.1 20.2 11.3 20.9 11.6C20.6 10 20 8.6 19 7.4L20.5 6C20 5.5 19.5 5 19 4.6L17.6 6C16.1 4.7 14.1 4 12 4C7 4 3 8 3 13S7 22 12 22H12.3C11.8 21.4 11.5 20.7 11.3 20Z"/></svg>
            </div>
            <div class="hidden group-focus:block group-focus-within:block hover:block absolute bottom-full rounded-md drop-shadow-xl bg-white w-48 -translate-x-24 ml-3 xs:ml-5 -mb-2 xs:mb-2 text-left">
                <form method="GET" action="" class="xs:p-3 p-1">
                    <label class="flex mb-0.5 xs:mb-2"><span class="inline-block w-1/2">Hours:</span> <input class="inline-block border w-1/2 px-1" name="hours" type="number" pattern="\d*" min="0" max="24" placeholder="0h"></label>
                    <label class="flex mb-0.5 xs:mb-2"><span class="inline-block w-1/2">Minutes:</span> <input class="inline-block border w-1/2 px-1" name="minutes" type="number" pattern="\d*" min="0" max="60" placeholder="0m"></label>
                    <label class="flex mb-0.5 xs:mb-2"><span class="inline-block w-1/2">Seconds:</span> <input class="inline-block border w-1/2 px-1" name="seconds" type="number" pattern="\d*" min="0" max="60" placeholder="0s"></label>
                    <input class="hidden" name="sync-token" type="hidden" min="0" max="60" value="">
                    <button class="block w-full border rounded bg-blue-500 border-blue-600 drop-shadow-sm xs:py-2 py-0.5 text-center text-white" onclick="view.actions.reloadUserEdits(); return false;">Update</button>
                </form>
            </div>
        </div>
    </div>
    <div class="">
        <div id="alerts"></div>
        <!-- Progress bars -->
        <div id="top-progress-bar" class="absolute top-0 right-0 left-0 h-1"><div class="progress top-0 left-0 absolute h-full w-0 bg-slate-600 transition-all"></div></div>
        <div id="right-progress-bar" class="absolute top-0 right-0 bottom-0 w-1"><div class="progress top-0 left-0 absolute h-0 w-full bg-slate-600 transition-all"></div></div>
        <div id="bottom-progress-bar" class="absolute right-0 bottom-0 left-0 h-1"><div class="progress top-0 right-0 absolute h-full w-0 bg-slate-600 transition-all"></div></div>
        <div id="left-progress-bar" class="absolute top-0 bottom-0 left-0 w-1"><div class="progress absolute bottom-0 left-0 h-0 w-full bg-slate-600 transition-all"></div></div>
    </div>
</body>
</html>