import {randomUUID} from 'node:crypto'

export class DatabaseMemory {
    #posts = new Map();


  createpost(post) {
        const PostId = randomUUID();
        this.#posts.set(PostId, post)
  }

  updatePost(id, post) {
    this.#posts.set(id, post);
  }

  deletePost(id) {
    this.#posts.delete(id);
  }

listPosts(search) {
  return Array.from(this.#posts.entries())
    .map(([id, post]) => ({
      id,
      ...post
    }))
    .filter((post) => {
      if (search) {
        return post.title.toLowerCase().includes(search.toLowerCase());
      } else {
        return true;
      }

    });
}

} 