/**
 * Virtual computer for re4 
 * @module re4.vm
 * @namespace re4
 */

re4.fw.requires(["re4.fw"]);

/**
 * Virtual computer infrastructure for re4 
 * @class vm
 * @static
 */
re4.fw.provides("re4.vm");
















































/* jsbmp

Create bitmap files using JavaScript. The use-case this was written
for is to create simple images which can be provided in `data` URIs.

Copyright (c) 2009 Sam Angove <sam [a inna circle] rephrase [period] net>

License: MIT

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
Create the binary contents of a bitmap file.

This is not a public interface and is subject to change.

Arguments:

    width -- width of the bitmap
    height -- height of the bitmap
    palette -- array of 'rrggbb' strings (if appropriate)
    imgdata -- pixel data in faux-binary escaped text
    bpp -- bits per pixel; use in conjunction with compression
    compression -- compression mode (e.g. uncompressed, 8-bit RLE, 4-bit RLE)
*/
function _bmp(width, height, palette, imgdata, bpp, compression) {

    var imgdatasize = imgdata.length;
    var palettelength = palette.length;
    var palettesize = palettelength * 4; // 4 bytes per colour
    var filesize = 64 + palettesize + imgdatasize; // size of file
    var pixeloffset = 54 + palettesize; // pixel data offset
    var data = [
        "BM",                                 // magic number
        _pack(width),      // size of file
        "\x00\x00\x00\x00",               // unused
        _pack(pixeloffset),   // number of bytes until pixel data
        "\x28\x00\x00\x00",               // number of bytes left in the header
        _pack(width),         // width of pixmap
        _pack(height),        // height of pixmap
        "\x01\x00",                         // number of colour planes, must be 1
        _pack(bpp, 2),           // bits per pixel
        _pack(compression),   // compression mode
        _pack(imgdatasize),   // size of raw BMP data (after the header)
        "\x13\x0B\x00\x00",               // # pixels per metre horizontal res.
        "\x13\x0B\x00\x00",               // # pixels per metre vertical res
        _pack(palettelength), // num colours in palette
        "\x00\x00\x00\x00"                // all colours are important

        // END OF HEADER
     ];

    for (var i=0; i<palette.length; ++i) {
        data.push(_pack(parseInt(palette[i], 16)));
    }
    data.push(imgdata);
    return data.join("");
}
/*
Pack JS integer (signed big-endian?) `num` into a little-endian binary string
of length `len`.
*/
function _pack(num, len) {
    var o = [], len = ((typeof len == 'undefined') ? 4 : len);
    for (var i=0; i<len; ++i) {
        o.push(String.fromCharCode((num >> (i * 8)) & 0xff));
    }
    return o.join("");
}


/*
Create an uncompressed Windows bitmap (BI_RGB) given width, height and an
array of pixels.

Pixels should be in BMP order, i.e. starting at the bottom left, going up
one row at a time.

Example:

    var onebluepixel = bmp(1, 1, ['0000ff']);
*/
function bmp_rgb(width, height, pixarray) {
    var rowsize = (width * 3);
    var rowpadding = (rowsize % 4);
    if (rowpadding) rowpadding = Math.abs(4 - rowpadding);
    var imgdatasize = (rowsize + rowpadding) * height;

    var i, j, pix;
    var pixcache = {};
    // Based on profiling, it's more than 10x faster to reverse the array
    // and pop items off the end than to shift them of the front. WTF.
    //pixarray.reverse();
    var pixels = [];
    for (i=0; i<height; ++i) {
        for (j=0; j<width; ++j) {
            pix = pixarray.pop();
            if (typeof pixcache[pix] == 'undefined')
                pixcache[pix] = _pack(parseInt(pix, 16), 3);
            pixels.push(pixcache[pix]);
        }
        for (j=0; j<rowpadding; ++j) {
            pixels.push("\x00");
        }
    }
    return _bmp(width, height, [], pixels.join(""), 24, 0);
}


/*
Create a Windows bitmap encoded with 8-bit run-length encoding (BI_RLE8)
given width, height and an array of [colour, runlength] pairs.

Pixels should be in BMP order, i.e. starting at the bottom left, going up
one row at a time.

Example:

    var twothousandbluepixels = bmp(2000, 1, ['0000ff', 2000]);
*/
function bmp_rle8(width, height, pixarray) {
    // Based on profiling, it's more than 10x faster to reverse the array
    // and pop items off the end than to shift them of the front. WTF.
    pixarray.reverse();
    var pixcache = {};
    var palette = [];
    var pixels = [], linelen, run, colour, runlength;
    for (var i=0; i<height; ++i) {
        linelen = 0;
        while (linelen < width) {
            run = pixarray.pop();
            colour = run[0];
            runlength = run[1];
            // Length has to fit in one byte, so split into multiple blocks
            // if the run is too long.
            if (runlength > 255) {
                pixarray.push([colour, runlength-255]);
                runlength = 255;
            }
            if (typeof pixcache[colour] == 'undefined') {
                pixcache[colour] = _pack(palette.length, 1);
                palette.push(colour);
            }
            pixels.push(_pack(runlength, 1));
            pixels.push(pixcache[colour]);
            linelen += runlength;
        }
        // end of line marker
        pixels.push('\x00\x00');
    }
    pixels.push('\x00\x01');
    return _bmp(width, height, palette, pixels.join(""), 8, 1);
}

/* datauri

Create base64encoded `data` URIs from binary data.

Copyright (c) 2009 Sam Angove <sam [a inna circle] rephrase [period] net>

License: MIT

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
Base64 encode binary data for ASCII transport

See: http://en.wikipedia.org/wiki/Base64
*/
var base64encode = function(){
    // This is a non-standard extension available in Mozilla
    // and possibly other browsers.
    if (typeof window.btoa != "undefined")
        return window.btoa;

    /* JS fallback based on public domain code from Tyler Akins:
        http://rumkin.com/tools/compression/base64.php */
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function _btoa(data) {
        var chr1, chr2, chr3, enc1, enc2, enc3,
            i=0, length=data.length, output="";
        while (i < length) {
            // Convert 3 bytes of data into 4 6-bit chunks
            chr1 = data.charCodeAt(i++);
            chr2 = data.charCodeAt(i++);
            chr3 = data.charCodeAt(i++);

            enc1 = chr1 >> 2;                       // reduce byte to 6 bits
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); // last 2 bits of chr1 + first 4 of chr2
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);// last 4 bits of chr2 + first 2 of chr3
            enc4 = chr3 & 63;                       // last 6 bits

            if (isNaN(chr2)) enc3 = enc4 = 64;      // pad with zeroes if necessary
            else if (isNaN(chr3)) enc4 = 64;

            output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
        }
        return output;
    }
    return _btoa;
}();

/*
Convert binary data to a `data` URI.

    See: http://en.wikipedia.org/wiki/Data_URI_scheme
*/
function datauri(content_type, data) {
    return "data:" + content_type
                   + ";base64,"
                   + encodeURIComponent(base64encode(data));
}

