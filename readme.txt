1. `npm run build` or `npm run prod`


## Countdown timer
You can embed the iframe like this
```
<iframe width="{{width}}" height="{{height}}" loading="lazy" allowfullscreen="true" src="https://stage.hypercontext.com/embeds/countdown.html" title="Countdown Timer - Free Meeting Tools- Hypercontext.com"></iframe>
```

the iframe supports customization via query strings. The following are supported

Basic usage:
- `days` - initial value for days on the count down timer. default 0.
- `hours` - initial value for hours on the count down timer. default 0.
- `minutes` - initial value for minutes on the count down timer. default 10.
- `seconds` - initial value for seconds on the count down timer. default 0.
- `autoplay` - true/false if it should start counting without user interaction. Default false.

Theming to match your app:
- `bg-color` - background color of the component
- `text-color` - text color of the component
- `progress-color` - progressbar color of the component
- `bg-color-warning` - background color of the component during the final 10 seconds
- `text-color-warning` - text color of the component during the final 10 seconds
- `progress-color-warning` - progress bar color of the component during the final 10 seconds
- `bg-color-alarm` - background color of the component when the timer is over
- `text-color-alarm` - text color of the component when the timer is over
- `progress-color-alarm` - progress bar color of the component when the timer is over

Internal state that can be pre-set
- `update-interval` - how fast the click ticks in ms. default 500.
- `time-remaining` - how much time should be remaining in the timer for initial load, in milliseconds. default null
- `time-elapsed` - how much time should have already ticked away for initial load, in milliseconds. default null
- `time-elapsed-percent` - how much of the timer is complete for initial load, in milliseconds. default null
- `target-time` - target time it should be counting towards in milliseconds since epoch (eg end of meeting, or starttime + 5min). default null. If present it overwrites days/hours/minutes/seconds.

Advanced / For Shared State:
- `sync-token` - default null. If set the iframe will send postMessages to the parent window with changes to the countdown timers state. eg

example message:
```
'hypercontext.com': {
    'event': 'updated-state',
    'reason': /* short description of what happened that caused this to fire */,
    'sync-token': /* ...exact same sync-token passed to component */,
    'state': /*... urlencoded & json stringified object of all the attributes within the component */,
    'url': /*... url for current iframes state */
}
```

The url value in the above example can be loaded for others to follow along (but will cause a brief reload for them)

The state value can be postMessage'd to other iframes to update the state of the timer without causing a reload.
