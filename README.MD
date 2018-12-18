# git-style-image-diff

One missing ad can cause two screenshots to be reported as completely different when using regular pixel-to-pixel diffing. This little experiment tries to do something a bit more sophisticated and compares images line by line using git-like diffing algorithm. It works pretty well for single column layouts, but fails in multi-column scenarios.

![./demo.png]()

** ⚠️ This is a fun experimient, not something I'm planning to finish, or maintain ️⚠️ **

## How to run it

1. `git clone`
2. `npm i`
3. `node main`

## Cavats

1. Paths to input images are hadcoded (YOLO).
2. It's rather slow (I only added a fast path for identical pixels).
3. As mentioned in the description, this works well only for single column layouts (which are not as popular as one may think). There are probably better, and more sophisticated, techniques of comparing website screenshots out there (let me know if you find one!).

## License

MIT