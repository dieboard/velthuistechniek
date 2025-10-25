# Deployment Guide: Automated Content Management

This guide explains how to set up the automated content management system for this project. This system uses a Netlify serverless function to update the `content.json` file directly from the admin panel, eliminating the need to manually download and upload the file.

## Prerequisites

- A GitHub account with ownership of this repository.
- A free Netlify account.

## Setup Instructions

### Step 1: Create a GitHub Personal Access Token (PAT)

The serverless function needs a GitHub PAT to get permission to write to your repository.

1.  **Go to your GitHub settings:**
    *   Click on your profile picture in the top-right corner and select "Settings".
2.  **Navigate to Developer settings:**
    *   In the left sidebar, scroll down and click on "Developer settings".
3.  **Go to Personal access tokens:**
    *   Select "Personal access tokens" > "Tokens (classic)".
4.  **Generate a new token:**
    *   Click "Generate new token" (select "Generate new token (classic)").
5.  **Configure the token:**
    *   **Note:** Give your token a descriptive name, like `VELTHUIS_CMS_UPDATER`.
    *   **Expiration:** Set an expiration date. For security, 90 days is a good default, but you can choose what's best for you.
    *   **Select scopes:** Check the box next to **`repo`**. This will grant the token full control of private repositories, which is what's needed to read and write the `content.json` file.
6.  **Generate and copy the token:**
    *   Click "Generate token".
    *   **Important:** Copy the token immediately and save it somewhere secure. You will not be able to see it again after you leave this page.

### Step 2: Deploy the Site on Netlify

1.  **Log in to your Netlify account.**
2.  **Create a new site:**
    *   From your dashboard, click "Add new site" and select "Import an existing project".
3.  **Connect to GitHub:**
    *   Choose "Deploy with GitHub" and authorize Netlify to access your repositories.
4.  **Select your repository:**
    *   Find and select the `velthuistechniek` repository.
5.  **Configure deployment settings:**
    *   Netlify should automatically detect the settings. Since this is a static site with no build step, the default settings are usually correct.
    *   The `netlify.toml` file in the repository tells Netlify where to find the serverless functions, so you don't need to configure that manually.
6.  **Deploy the site:**
    *   Click "Deploy site".

### Step 3: Configure Environment Variables

This is the final and most important step. We need to give Netlify the GitHub PAT and other necessary information.

1.  **Go to your new site's settings on Netlify.**
2.  **Navigate to Environment variables:**
    *   In the left sidebar, go to "Site configuration" > "Environment variables".
3.  **Add the following variables:**
    *   Click "Add a variable" and create the following three entries:

        | Key             | Value                                                              |
        | --------------- | ------------------------------------------------------------------ |
        | `GITHUB_TOKEN`  | The GitHub Personal Access Token you created in Step 1.            |
        | `GITHUB_OWNER`  | Your GitHub username (e.g., `Jules-the-AI`).                       |
        | `GITHUB_REPO`   | The name of your repository (e.g., `velthuistechniek`).            |

4.  **Redeploy the site:**
    *   After adding the variables, you need to trigger a new deploy for the changes to take effect.
    *   Go to the "Deploys" tab for your site and click "Trigger deploy" > "Deploy site".

## You're Done!

Once the site has finished redeploying, the automated content management system will be active. You can now go to the `/admin.html` page on your new Netlify URL, make changes, and click "Save Changes". The updates will be automatically committed to your GitHub repository.
