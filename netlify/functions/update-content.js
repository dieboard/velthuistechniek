const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Handle preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }

    // Ensure the request is a POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_OWNER } = process.env;
    const contentPath = 'content.json';
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${contentPath}`;

    try {
        const updatedContent = JSON.parse(event.body);

        // 1. Get the current SHA of the file
        const getFileResponse = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!getFileResponse.ok) {
            throw new Error(`Failed to fetch file SHA: ${getFileResponse.statusText}`);
        }

        const fileData = await getFileResponse.json();
        const currentSha = fileData.sha;

        // 2. Prepare the new content
        const newContentBase64 = Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64');

        // 3. Commit the updated file
        const updateFileResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'feat: Update content.json via CMS',
                content: newContentBase64,
                sha: currentSha,
            }),
        });

        if (!updateFileResponse.ok) {
            const errorBody = await updateFileResponse.json();
            console.error('GitHub API Error:', errorBody);
            throw new Error(`Failed to update file: ${updateFileResponse.statusText}`);
        }

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Content updated successfully!' }),
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'An error occurred while updating the content.', error: error.message }),
        };
    }
};
