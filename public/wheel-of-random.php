<?php
$url =  "https://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
$escaped_url = htmlspecialchars( $url );

$title = "Wheel of Random Options Picker";
if(isset($_GET['question'])){
    $title = htmlspecialchars($_GET['question']);
    $title = "Random ".$title." option picker";
}

?>
<!doctype html>
<html lang="en" class="h-full w-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="googlebot" content="noindex,indexifembedded" />
  <title><?php echo $title;?> - Free Meeting Tools</title>
  <link rel="alternate" type="application/json+oembed"
    href="http://hypercontext.com/embeds/oembed.php?url=<?php echo ($escaped_url);?>&format=json"
    title="<?php echo $title;?>" />
  <script type="text/javascript" src="bundle-wheel.js"></script>
</head>
<body class="w-full h-full bg-slate-200">
    <div class="absolute top-0 left-0 right-0 h-4">
        <!-- header -->
        <button id="toggle-fullscreen" aria-label="Toggle Fullscreen" class="z-10 absolute right-1 top-1 p-1 xs:p-2 rounded-md transition-all border border-transparent hover:border-gray-400 hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
            <svg class="xs:w-6 w-4 xs:h-6 h-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M12 5.5L10 8H14L12 5.5M18 10V14L20.5 12L18 10M6 10L3.5 12L6 14V10M14 16H10L12 18.5L14 16M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3M21 19H3V5H21V19Z"/></svg>
        </button>
    </div>

    <div class="absolute w-full h-full flex items-center">
        <div class="w-1/2 stage xs:pl-2 sm:pl-10" style="height:30vh">
            <div class="scene">
                <div class="carousel"></div>
              </div>
        </div>
        <div class="w-1/2 h-full relative p-10 pr-1 xs:pr-2 sm:pr-10 pl-3 drop-shadow-md">
            <div class="border-[30px] border-solid border-transparent border-r-white w-0 h-0 -mt-[30px] -left-[45px] top-1/2 absolute"></div>
            <div class="border-[20px] border-solid border-transparent border-r-slate-500 w-0 h-0 -mt-[20px] -left-[25px] top-1/2 absolute"></div>
            <div class="w-full h-full bg-white rounded-lg relative overflow-clip flex flex-col justify-between">
                <h1 class="question-heading-title text-xl sm:text-2xl md:text-4xl font-bold text-center mt-3 xs:mt-8 md:mt-16 px-4"></h1>
                <div class="text-center mb-8 mt-1">
                    <div tabindex="0" role="button" class="spin-button spin-button-title inline-block p-2 xs:py-3 xs:px-6 sm:py-4 sm:px-12 text-2xl font-bold border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                        <svg class="w-6 h-6 inline sm:block sm:w-9 sm:h-9 sm:mx-auto sm:mb-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 10H9.09C9.43 6.55 10.6 4 12 4S14.57 6.55 14.91 10H16.9C16.44 5.44 14.42 2 12 2S7.56 5.44 7.1 10H4L8 14L12 10M12 20C10.73 20 9.64 17.89 9.21 14.92L8 16.12L7.3 15.42C8 19.26 9.84 22 12 22C14.42 22 16.44 18.56 16.9 14H14.91C14.57 17.45 13.4 20 12 20M22 11H13L11 13H22V11M2 13H5L3 11H2V13" />
                        </svg>
                        <span class="text">Spin</span>
                    </div>
                </div>
                
                <!-- footer -->
                <div class="p-4 w-full flex align-end content-end justify-center bg-gray-200/50">
                    <div tabindex="0" role="button" class="inline-block mx-1 p-1 sm:p-2 text-sm text-center border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none" onclick="view.actions.shuffleOptions();">
                        <svg class="xs:w-4 w-3 xs:h-4 h-3 inline-block align-text-top" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17,3L22.25,7.5L17,12L22.25,16.5L17,21V18H14.26L11.44,15.18L13.56,13.06L15.5,15H17V12L17,9H15.5L6.5,18H2V15H5.26L14.26,6H17V3M2,6H6.5L9.32,8.82L7.2,10.94L5.26,9H2V6Z" />
                        </svg>
                        <span class="hidden md:inline">Shuffle</span>
                    </div>
                    <div tabindex="0" role="button" class="previous-button inline-block mx-1 p-1 sm:p-2 text-sm text-center border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                        <svg class="xs:w-4 w-3 xs:h-4 h-3 inline-block align-text-top" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11,6V14L7.5,10.5L6.08,11.92L12,17.84L17.92,11.92L16.5,10.5L13,14V6H11M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z" />
                        </svg>
                        <span class="hidden md:inline">Previous</span>
                    </div>
                    <div tabindex="0" role="button" class="next-button inline-block mx-1 p-1 sm:p-2 text-sm text-center border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                        <svg  class="xs:w-4 w-3 xs:h-4 h-3 inline-block align-text-top" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13,18V10L16.5,13.5L17.92,12.08L12,6.16L6.08,12.08L7.5,13.5L11,10V18H13M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" />
                        </svg>
                        <span class="hidden md:inline">Next</span>
                    </div>
                    <div tabindex="0" role="button" aria-label="Change Settings of Timer" class="flex mx-1 group relative">
                        <label for="options-text" class="inline-block peer p-1 sm:p-2 text-sm text-center border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                            <svg class="xs:w-4 w-3 xs:h-4 h-3 inline-block align-text-top" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15.9,18.45C17.25,18.45 18.35,17.35 18.35,16C18.35,14.65 17.25,13.55 15.9,13.55C14.54,13.55 13.45,14.65 13.45,16C13.45,17.35 14.54,18.45 15.9,18.45M21.1,16.68L22.58,17.84C22.71,17.95 22.75,18.13 22.66,18.29L21.26,20.71C21.17,20.86 21,20.92 20.83,20.86L19.09,20.16C18.73,20.44 18.33,20.67 17.91,20.85L17.64,22.7C17.62,22.87 17.47,23 17.3,23H14.5C14.32,23 14.18,22.87 14.15,22.7L13.89,20.85C13.46,20.67 13.07,20.44 12.71,20.16L10.96,20.86C10.81,20.92 10.62,20.86 10.54,20.71L9.14,18.29C9.05,18.13 9.09,17.95 9.22,17.84L10.7,16.68L10.65,16L10.7,15.31L9.22,14.16C9.09,14.05 9.05,13.86 9.14,13.71L10.54,11.29C10.62,11.13 10.81,11.07 10.96,11.13L12.71,11.84C13.07,11.56 13.46,11.32 13.89,11.15L14.15,9.29C14.18,9.13 14.32,9 14.5,9H17.3C17.47,9 17.62,9.13 17.64,9.29L17.91,11.15C18.33,11.32 18.73,11.56 19.09,11.84L20.83,11.13C21,11.07 21.17,11.13 21.26,11.29L22.66,13.71C22.75,13.86 22.71,14.05 22.58,14.16L21.1,15.31L21.15,16L21.1,16.68M6.69,8.07C7.56,8.07 8.26,7.37 8.26,6.5C8.26,5.63 7.56,4.92 6.69,4.92A1.58,1.58 0 0,0 5.11,6.5C5.11,7.37 5.82,8.07 6.69,8.07M10.03,6.94L11,7.68C11.07,7.75 11.09,7.87 11.03,7.97L10.13,9.53C10.08,9.63 9.96,9.67 9.86,9.63L8.74,9.18L8,9.62L7.81,10.81C7.79,10.92 7.7,11 7.59,11H5.79C5.67,11 5.58,10.92 5.56,10.81L5.4,9.62L4.64,9.18L3.5,9.63C3.41,9.67 3.3,9.63 3.24,9.53L2.34,7.97C2.28,7.87 2.31,7.75 2.39,7.68L3.34,6.94L3.31,6.5L3.34,6.06L2.39,5.32C2.31,5.25 2.28,5.13 2.34,5.03L3.24,3.47C3.3,3.37 3.41,3.33 3.5,3.37L4.63,3.82L5.4,3.38L5.56,2.19C5.58,2.08 5.67,2 5.79,2H7.59C7.7,2 7.79,2.08 7.81,2.19L8,3.38L8.74,3.82L9.86,3.37C9.96,3.33 10.08,3.37 10.13,3.47L11.03,5.03C11.09,5.13 11.07,5.25 11,5.32L10.03,6.06L10.06,6.5L10.03,6.94Z" />
                            </svg>
                            <span class="hidden md:inline">Settings</span>
                        </label>
                        <div class="hidden group-focus:block group-focus-within:block hover:block absolute bottom-full rounded-md drop-shadow-2xl border border-black/20 bg-white w-48 -translate-x-32 ml-3 xs:ml-5 -mb-2 xs:mb-2 text-left">
                            <div class="xs:p-3 p-1">
                                <div class="">
                                    <input type="text" class="question-input-title border block px-2 py-1 w-full xs:mb-2 text-sm">
                                    <textarea id="options-text" class="options-textarea border block px-2 py-1 w-full xs:mb-2 h-[30vh] text-sm" style="white-space: pre;overflow-wrap: normal;overflow-x: scroll;">Brennan|#151517|https://ca.slack-edge.com/T028FU766-U028F83P7-c129603c2804-512
Graham|#000|https://ca.slack-edge.com/T028FU766-U028FU76A-67be5167aeb3-512
Chris
Adam
Lucas
Jocelyn
Nicole
Gp
Kiran
Dave
Ed
Hetvi
Nico
Juan
Eli
Karine</textarea>
                <button class="update-options block w-full border rounded bg-blue-500 border-blue-600 drop-shadow-sm xs:py-2 py-0.5 text-center text-white" >Update</button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div tabindex="0" role="button" aria-label="Copy Share link" class="flex mx-1 group relative">
                        <label for="sharelink-text" class="inline-block peer p-1 sm:p-2 text-sm text-center border rounded-md drop-shadow border-gray-400 bg-gray-200 transition-all hover:bg-gray-100 hover:drop-shadow-xl active:bg-gray-300 active:drop-shadow-none">
                            <svg class="xs:w-4 w-3 xs:h-4 h-3 inline-block align-text-top" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M21,12L14,5V9C7,10 4,15 3,20C5.5,16.5 9,14.9 14,14.9V19L21,12Z" />
                            </svg>
                            <span class="hidden md:inline">Share</span>
                        </label>
                        <div class="hidden group-focus:block group-focus-within:block hover:block absolute bottom-full rounded-md drop-shadow-2xl border border-black/20 bg-white w-48 -translate-x-36 ml-3 xs:ml-5 -mb-2 xs:mb-2 text-left">
                            <div class="xs:p-3 p-1">
                                <div class="mb-2">
                                    <p class="text-xs text-gray-600">Copy the url:</p>
                                    <textarea id="sharelink-text" class="sharelink-textarea border block px-2 py-1 w-full h-6 text-xs"></textarea>
                                </div>

                                <div class="">
                                    <p class="text-xs text-gray-600">Copy the embed code:</p>
                                    <textarea id="shareembed-text" class="shareembed-textarea border block px-2 py-1 w-full h-[15vh] min-h-7 max-h-40 text-xs"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- footer -->
            </div>
        </div>
    </div>
</body>
</html>