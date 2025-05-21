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