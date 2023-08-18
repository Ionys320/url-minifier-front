import { UrlInterface } from "../interfaces/url.interface";

export class Url implements UrlInterface {
    id: number;
    minified: string;
    base: string;
    title?: string;
    _tags?: string;
    visits: number;

    constructor(id: number = -1, minified: string = '', base: string = '', title: string = 'New minified URL', tags?: string, visits?: number) {
        this.id = id;
        this.minified = minified;
        this.base = base;
        this.title = title;
        this._tags = tags;
        this.visits = visits ?? 0;
    }

    public static fromJSON(json: UrlInterface): Url {
        return new Url(
            json.id,
            json.minified,
            json.base,
            json.title,
            json.tags,
            json.visits
        );
    }

    public static fromJSONs(jsons: UrlInterface[]): Url[] {
        return jsons.map(Url.fromJSON);
    }

    public toJSON(): UrlInterface {
        return {
            id: this.id,
            minified: this.minified,
            base: this.base,
            title: this.title,
            tags: this._tags,
            visits: this.visits
        };
    }

    get fullMinified(): string {
        return `${location.origin}/l/${this.minified}`;
    }

    get tags(): string {
        return this._tags?.replaceAll('|', ', ') ?? '';
    }

    set tags(tags: string) {
        this._tags = tags.replaceAll(', ', ',').replaceAll(',', '|');
    }
}