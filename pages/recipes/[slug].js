import { useState } from "react";
import { useRouter } from 'next/router';

import { 
    sanityClient, 
    urlFor, 
    usePreviewSubscription,
    PortableText
} from "../../lib/sanity";


const recipesQuery = `*[_type == 'recipe' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions, 
    likes
}`;


export default function OneRecipe({ data, preview }) {

    const router = useRouter();
    if(router.isFallback){
        return <div>Loading...</div>
    }

    // const { data: recipe } = usePreviewSubscription(recipesQuery, {
    //     params: { slug: data.recipe?.slug.current },
    //     initialData: data,
    //     enabled: preview,
    // });

    const [likes, setLikes] = useState(data?.recipe?.likes);

    const addLike = async () => {
        const res = await fetch('/api/handle-likes', {
            method: "POST",
            body: JSON. stringify({ _id: recipe._id }),
        }).catch((error) => console.log(error))
    
        const data = await res.json();

        setLikes(data.likes);
    };


    const { recipe } = data;

    return (
        <article className="recipe">
            <h1>{recipe.name}</h1>

            <button onClick={addLike} className="like-button">{likes} likes</button>
            <main className="content">
                <img src={urlFor(recipe?.mainImage).url()} alt={recipe.name}/>
                <div className="breakdown">
                    <ul className="ingredients">
                        {recipe.ingredient?.map((ingredient)=>(
                        <li key={ingredient._key} className="ingredient">
                            {ingredient?.wholeNumber}
                            {ingredient?.fraction}
                            {' '}
                            {ingredient?.unit}
                            <br />
                            {ingredient?.ingredient.name}
                        </li>
                        ))}
                    </ul>
                   
                    {/* <PortableText 
                        value={data?.recipe?.instructions}
                        components={{
                            block: {
                                h1: ({children}) => <h1>{children}</h1>,
                                customHeading: ({children}) => (
                                    <h2>{children}</h2>
                                ),
                            },
                        }}
                    /> */}
                </div>
            </main>
        </article>
    )
};

export async function getStaticPaths() {        // knowing every path

    const paths = await sanityClient.fetch(
        `*[_type == 'recipe' && defined(slug.current)]{
            'params': {
                'slug': slug.current
            }
        }`
    );
    return {
        paths,
        fallback: true
    }
};

export async function getStaticProps({ params }){       // knowing what's inside the paths = content

    const { slug } = params;
    const recipe = await sanityClient.fetch(recipesQuery, {slug});
    return { props: { data: { recipe }, preview: true } };
}