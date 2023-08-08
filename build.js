import dotenv from 'dotenv'
import octokit from '@octokit/core'
import { getNewContent, merge } from './build-local.js';
import { REPO, TARGET_FILE, USERNAME } from './config.js';

dotenv.config()
const client = new octokit.Octokit({ auth: process.env.TOKEN });

async function updateReadme(repo = REPO) {
  try {
    const res = await client.request(`GET /repos/${USERNAME}/${repo}/contents/${TARGET_FILE}`)
    const { path, sha, content, encoding } = res.data
    const oldContent = Buffer.from(content, encoding).toString();
    const newContent = getNewContent()
    const updatedContent = merge(oldContent, newContent);

    /* WARNING: infinite loop */
    // console.log({oldContent, updatedContent})
    if (oldContent !== updatedContent) {
      // console.log({oldContent, updatedContent})
      commitNewReadme(repo, path, sha, encoding, updatedContent)
    } else {
      console.log("No need to update.")
    }
  } catch (error) {
    console.log(error)
  }
}

async function commitNewReadme(repo, path, sha, encoding, updatedContent) {
  // console.log(Buffer.from(updatedContent, "utf-8").toString(encoding))
  try {
    await client.request(`PUT /repos/${USERNAME}/${repo}/contents/${path}`, {
      message: `Update ${TARGET_FILE} from script`,
      content: Buffer.from(updatedContent, "utf-8").toString(encoding),
      path,
      sha
    });
  } catch (error) {
    console.log(error)
  }
}

updateReadme(REPO)
