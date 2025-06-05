export interface AccessIds {
    unipile_id: string;
    access_token: string;
}

export interface KeywordsTable {
    keywords: string[];
    unipile_id: string;
    unipile_table?: AccessIds
}

export interface FilterTimezoneReq {
    unipile_id: string;
    user_timezone: {
        timezone: string;
        created_at: string;
    }
}

export interface LinkedInPost {
    type: string;
    provider: string;
    social_id: string;
    share_url: string;
    date: string;
    parsed_datetime: string;
    comment_counter: number;
    impressions_counter: number;
    reaction_counter: number;
    repost_counter: number;
    permissions: object;
    text: string;
    attachments: any[];
    author: object;
    is_repost: boolean;
    id: string;
}

export interface QdrantSearchResult {
    id: string | number;
    version: number;
    score: number;
    payload?: {unipile_id:string,comment:string,post:string};
    vector?: number[];
    shard_key?: string | number | Record<string, unknown> | null | undefined;
    order_value?: number | Record<string, unknown> | null | undefined;
}

export interface QdrantResponse extends AllComments {
    points: QdrantSearchResult[];
}

export interface CommentVectorSearch {
    id: string | number;
    version: number;
    score: number;
    payload?: Record<string, unknown> | {
        [key: string]: unknown;
    } | null | undefined;
    vector?: Record<string, unknown> | number[] | number[][] | {
        [key: string]: number[] | number[][] | {
            indices: number[];
            values: number[];
        } | undefined;
    } | null | undefined;
    shard_key?: string | number | Record<string, unknown> | null | undefined;
    order_value?: number | Record<string, unknown> | null | undefined;
}[]
export interface AllComments {
    points: {
        id: string | number;
        payload?: Record<string, unknown> | {
            [key: string]: unknown;
        } | null | undefined;
        vector?: Record<string, unknown> | number[] | number[][] | {
            [key: string]: number[] | number[][] | {
                indices: number[];
                values: number[];
            } | undefined;
        } | null | undefined;
        shard_key?: string | number | Record<string, unknown> | null | undefined;
        order_value?: number | Record<string, unknown> | null | undefined;
    }[];
    next_page_offset?: string | number | Record<string, unknown> | null | undefined;
}

export interface CommentProposal{
    id: string;
    created_at: string;
    post_text: string;
    post_link: string;
    comment_IA: string;
    author_name: string;
    post_id: string;
}[]

export type CreditAmount = 10 | 20 | 90 | 180;