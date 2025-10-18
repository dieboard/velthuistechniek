# Content Management Guide

This guide explains how to update the content of your website.

## Editing Text

All the text on the website is in the `index.html` file. You can edit this file to change the text.

For example, to change the "About Us" section, find this part of the code in `index.html` and edit the text inside the `<p>` tags:

```html
<section id="about">
    <h2>Over Ons</h2>
    <p>Hier komt de tekst over ons bedrijf. We zijn gespecialiseerd in beveiligingsinstallaties en bieden op maat gemaakte oplossingen voor zowel particulieren als bedrijven.</p>
</section>
```

## Managing Images

To add or change images in the gallery, you need to do two things:

1.  **Add the image file:** Place your new image files in the `images/` directory.
2.  **Update the gallery:** In `index.html`, find the `<div class="gallery">` section. For each new image, add a new `<img>` tag like this:

```html
<div class="gallery">
    <!-- Add your new image here -->
    <img src="images/new-image.jpg" alt="A descriptive caption for the new image">

    <!-- Existing images -->
    <img src="images/placeholder1.webp" alt="Placeholder Image 1">
    <img src="images/placeholder2.webp" alt="Placeholder Image 2">
    ...
</div>
```

**Important:**
*   Replace `"images/new-image.jpg"` with the path to your new image.
*   Replace `"A descriptive caption for the new image"` with a short, descriptive caption that will be displayed below the image in the lightbox.

By following these instructions, you can easily keep your website's content up to date.