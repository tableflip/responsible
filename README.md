# Responsible - dealing with images responsibly

Find the breakpoints used on a website.
Check the rendered width of the images on a page at each breakpoint.
Recommend images sizes for `srcsets` and `sizes` attributes.
Create images optimising script that consumes the output, finds the images and resizes.

```sh
npm install

casperjs sizes.js https://tableflip.io

5 images found:
/img/logo-stroke.svg 100 581
/img/icon-info.svg 19 99
/img/icon-briefcase.svg 24 48
/img/icon-blog.svg 20 100
/img/icon-phone.svg 20 80

2 breakpoints found
(min-width: 940px)
(min-width: 720px)

2 widths found
940px
720px
```



## Notes

README, is good: http://ericportis.com/posts/2014/srcset-sizes/

Can we WebP? http://caniuse.com/#search=webp%20image
Probably not.
