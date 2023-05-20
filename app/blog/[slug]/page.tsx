// export const revalidate = 420; // ISR implementation

interface Post {
    title: string;
    content: string;
    slug: string;
}

// for dynamic data that doesn't change often (ie. blog posts)
// export async function generateStaticParams() {
//     const posts: Post[] = await fetch('https://waveyspace.vercel.app/api/content').then(
//         (res) => res.json()
//     );

//     return posts.map((post) => ({
//         slug: post.slug,
//     }))
// }

interface Props {
    params: {slug: string};
}

export default async function BlogPostPage({params}: Props) {
    // // deduped
    // const posts: Post[] = await fetch('https://waveyspace.vercel.app/api/content').then(
    //     (res) => res.json()
    // )
    // const post = posts.find((post) => post.slug === params.slug)!;
    
    return (
        <div>
            {/* <h1>{post.title}</h1>
            <h1>{post.content}</h1> */}
        </div>
    )
}