import { gql } from 'graphql-request';

export const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                media(first: 10) {
                  edges {
                    node {
                      mediaContentType
                      ... on Video {
                        sources {
                          url
                          mimeType
                          height
                          width
                        }
                      }
                      ... on ExternalVideo {
                        embedUrl
                        host
                        originUrl
                      }
                      ... on MediaImage {
                        image {
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                }
                variants(first: 100) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      media(first: 10) {
        edges {
          node {
            mediaContentType
            ... on Video {
              sources {
                url
                mimeType
                height
                width
              }
            }
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTION = gql`
  query GetProductsByCollection($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            media(first: 10) {
              edges {
                node {
                  mediaContentType
                  ... on Video {
                    sources {
                      url
                      mimeType
                      height
                      width
                    }
                    preview {
                      image {
                        url
                      }
                    }
                  }
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          tags
          collections(first: 5) {
            edges {
              node {
                title
                handle
              }
            }
          }
          media(first: 10) {
            edges {
              node {
                mediaContentType
                ... on MediaImage {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
                ... on Video {
                  sources {
                    url
                    mimeType
                    height
                    width
                  }
                }
                ... on ExternalVideo {
                  embedUrl
                  host
                  originUrl
                }
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`; 