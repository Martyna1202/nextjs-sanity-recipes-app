import {
    createClient,
    createPreviewSubscriptionHook,
} from "next-sanity";

import createImageUrlBuilder from '@sanity/image-url';

import { PortableText as PortableTextComponent } from '@portabletext/react'

const config = {
    projectId: "m06n8ajn",
    dataset: "production",
    apiVersion: "2021-10-21",
    useCdn: true,
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const PortableText = (config) => <PortableTextComponent components={{}} {...config}/>;



// export const PortableText = PortableTextComponent({
//     ...config, 
//     serializers: {},
// });


// export const PortableText = (config) => <PortableTextComponent {...config} components= {{}} />;
// export const PortableText = (config) => <PortableTextComponent {...config} serializers= {{}} />;