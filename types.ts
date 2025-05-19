export interface AccessIds {
    unipile_id: string;
    access_token: string;
}

export interface KeywordsTable {
    keywords: string[];
    unipile_id: string;
    unipile_table?: AccessIds
}