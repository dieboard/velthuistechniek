# Content Management Guide

This guide explains how to update the project content on your website using the Decap CMS admin panel.

## Accessing the Admin Panel

1.  Navigate to `[your-website-url]/admin/`.
2.  You will be prompted to log in with your GitHub account.
3.  You must have write permissions to the [GitHub repository](https://github.com/dieboard/velthuistechniek) to log in.

## Managing Projects

Once logged in, you will see the **Projects** collection.

### Editing Existing Projects

1.  Click on the "Projects" entry in the left-hand sidebar.
2.  You will see a list of all current projects. Click on a project title to open the editor.
3.  In the editor, you can modify the following fields:
    *   **Title:** The main title of the project.
    *   **Tile Summary:** A short summary that appears on the project card on the homepage.
    *   **Tile Image:** The image displayed on the project card. You can drag and drop a new image or select one from the media library.
    *   **Modal Description:** The detailed description that appears in the project's pop-up modal. This field supports Markdown for text formatting.
    *   **Modal Images:** A gallery of images for the project modal. You can add, remove, or reorder images here.

### Creating a New Project

1.  From the "Projects" collection view, click the **"Add new"** button.
2.  Fill in the fields as described above.
3.  Click **"Publish"** to save the new project.

### Deleting a Project

1.  Open the project you wish to delete.
2.  Click the **"Delete"** button, which is typically found at the bottom of the editor page.

## Saving Changes

-   After making any changes, the **"Publish"** button at the top of the page will become active.
-   Click **"Publish"** and then **"Publish now"** to save your changes.
-   Decap CMS will automatically create a new commit in the GitHub repository with your updates. The website will rebuild and reflect the changes shortly after.
