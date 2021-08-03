import {Schema, model, Model, Document} from 'mongoose';

export interface ISite extends Document {
    siteURL: string;
    toJson(): string;
}

// define the schema for our site model
var siteSchema = new Schema({
    siteURL: {
        type: String,
        required: true,
        unique: true
    }
});

siteSchema.methods.toJson = function() {
    return {
        id: this._id,
        siteURL: (this as any).siteURL,
    }
}

// create the model for sites and expose it to our app
export default model('Site', siteSchema) as Model<ISite>;
