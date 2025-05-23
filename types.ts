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
