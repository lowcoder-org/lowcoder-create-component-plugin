# Using Lowcoder Zxing QRCode Reader Component Plugin

## Prerequisites
Before you start, ensure you have a running Lowcoder installation. Alternatively, you can use it online at [https://app.lowcoder.cloud](https://app.lowcoder.cloud).

## Steps to Use the Plugin
1. **Open the App Editor**: Navigate to the App Editor within your Lowcoder application.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Main%20Screeen%20clean.png" alt="Lowcoder App Editor">
</p>

1. **Access Components Panel**: In the App Editor, locate the right panel where components are listed.

2. **Switch to Extensions**: Find and switch on the "Extensions" toggle. This option allows you to add additional components to your project.

<p align="center">
  <img src="https://raw.githubusercontent.com/lowcoder-org/lowcoder-media-assets/main/images/App%20Editor%20%7C%20Import%20Component%20Plugin%201.png" alt="Lowcoder App Editor">
</p>

3. **Load the Plugin**: Here you have the option to load a Lowcoder Component Plugin from NPM. For example, to load the "hill charts" plugin, type `lowcoder-comp-qrcode-scanapp` in the provided field.

4. **Start Using the Plugin**: After loading the plugin, it will be available for use within your Lowcoder project. You can now integrate and customize the component as per your application's needs.

# ZXing

> [ZXing][1] ("zebra crossing") is an open-source, multi-format 1D/2D barcode image processing library implemented in Java, with ports to other languages.

## Supported Formats

> See [Projects](https://github.com/zxing-js/library/projects) and [Milestones](https://github.com/zxing-js/library/milestones) for what is currently done and what's planned next. 👀

| 1D product | 1D industrial                        | 2D           |
| ---------- |--------------------------------------|--------------|
| UPC-A      | Code 39                              | QR Code      |
| UPC-E      | Code 93                              | Data Matrix  |
| EAN-8      | Code 128                             | Aztec        |
| EAN-13     | Codabar                              | PDF 417      |
|            | ITF                                  | ~~MaxiCode~~ |
|            | RSS-14                               |              |
|            | RSS-Expanded (not production ready!) |              |

## Limitations

On iOS-Devices **with iOS < 14.3** camera access works only in native Safari and not in other Browsers (Chrome,...) or Apps that use an UIWebView or WKWebView. This is not a restriction of this library but of the limited WebRTC support by Apple. The behavior might change in iOS 11.3 (Apr 2018?, not tested) as stated [here](https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_11_1.html#//apple_ref/doc/uid/TP40014305-CH14-SW1)

> iOS 14.3 (released in december 2020) now supports WebRTC in 3rd party browsers as well 🎉 

### Browser Support

The browser layer is using the [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) web API which is not supported by older browsers.

_You can use external polyfills like [WebRTC adapter](https://github.com/webrtc/adapter) to increase browser compatibility._

Also, note that the library is using the [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) (`Int32Array`, `Uint8ClampedArray`, etc.) which are not available in older browsers (e.g. Android 4 default browser).

_You can use [core-js](https://github.com/zloirock/core-js) to add support to these browsers._

In the PDF 417 decoder recent addition, the library now makes use of the new `BigInt` type, which [is not supported by all browsers][2] as well. There's no way to polyfill that and ponyfill libraries are **way to big**, but even if PDF 417 decoding relies on `BigInt` the rest of the library shall work ok in browsers that doesn't support it.

_There's no polyfills for `BigInt` in the way it's coded in here._

