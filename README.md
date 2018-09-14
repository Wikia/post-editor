# post-editor (feel free to add a better name)
Quill-based editor for posts and replies, currently used in Discussions

Includes:
- inlined CSS
- Quill.core package
- Preact as a renderer

# How to start
- to bypass CORS limitations either install [this extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en) or apply [some of this setting](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome)
	* from Chrome 68+ CORB is installed by default so setting (`mode: 'no-cors`) will unblock CORS limitations but won't prevent CORB from blocking a request (see [this](https://www.chromium.org/Home/chromium-security/corb-for-developers) and [that](https://www.chromestatus.com/feature/5629709824032768) for details
- run `yarn` and `yarn start`

# How to build
- merge your PR
- run `yarn release:xxx` (see `package.json` for details)

# Dependencies
- Fandom Design System styles:
    - wds-icon (wds-components/_icons)
- Browsers which support Element.closest or polyfill
- whatwg-fetch polyfill (eg. [this one](https://github.com/github/fetch)) (see [docs](https://github.com/whatwg/fetch) for details
