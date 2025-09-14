import { sql } from "../../../db.js";

const viewCount = {}

export function registerView(postId) {
    if (!postId) return;

    if (!viewCount[postId]) {
        viewCount[postId] = 0;
    }
    viewCount[postId] += 1;

    if (viewCount[postId] >= 10) {
        console.log(`Post ${postId} has reached ${viewCount[postId]} views!`);
        const count = viewCount[postId];
        viewCount[postId] = 0; // reset count after logging

    sql`
        UPDATE posts
        SET views = views + ${count}
        WHERE id = ${postId}
    `
        .then(() => {
            console.log(`View count for post ${postId} updated successfully.`);
        })
        .catch((error) => {
            console.error(`Error updating view count for post ${postId}: `, error);
        });
    }
}