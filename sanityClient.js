import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'uvzhyfsx', // Replace with your actual project ID
  dataset: 'production', // Replace with your dataset name
  apiVersion: '2023-03-31', // Use the latest API version
  useCdn: true, // `false` if you want fresh data
});

export default sanityClient;
