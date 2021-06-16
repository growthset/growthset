import {Schema, model, Model, Document} from 'mongoose';

export interface IGuide extends Document {
    name: string;
    toJson(): string;
}

// define the schema for our guide model
var guideSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

guideSchema.methods.toJson = function() {
    return {
        id: this._id,
        name: (this as any).name,
    }
}

// create the model for guides and expose it to our app
export default model('Guide', guideSchema) as Model<IGuide>;
