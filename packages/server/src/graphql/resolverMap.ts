import { IResolvers } from 'graphql-tools';
import _ from 'lodash';
import * as typeDefs from './schema/schema.graphql';
import UserModel from '../model/User';
import GuideModel from '../model/Guide';
import { AuthenticationError } from 'apollo-server';

const resolverMap: IResolvers = {
  Query: {
    helloWorld(ignore: void, args: void): string {
        return `👋 Hello world! 👋`;
    },
    currentUser(ignore: void, args: void, context: any): string {
        return context.getUser()?.id;
    },
    listUsers(ignore: void, args: void, context: any): Promise<any[]> {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }

      return UserModel.find().exec();
    },
    listGuides(ignore: void, args: void, context: any): Promise<any[]> {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // TODO: Translate into public guides
      return GuideModel.find().exec();
    }
  },
  Mutation: {
    createGuide: async (parent, {guide}, context) => {
      console.log("createGuide called: " + guide)
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // generate UUID - Mongoose handles this for us I believe

      const nGuide = await GuideModel.create(guide);
      return nGuide?.toJson();
    },
    updateGuide: async (parent, {guide}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // TODO: Validation, also may need to adjust query
      console.log("Updating Guide: " + guide.id);
      console.log("GUIDE NAME: " + guide.name);
      await GuideModel.updateOne({_id: guide.id}, {name: guide.name});
      const nGuide = await GuideModel.findOne({_id: guide.id});
      console.log("Found Guide: " + nGuide);
      // NOTE: For now we return null if no guide is found, we probably should throw an error.
      
      return nGuide?.toJson();
    },
    deleteGuide: async (parent, {id}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      console.log("deleting guide: " + id);
      const result = await GuideModel.deleteOne({_id: id});
      console.log(result);
      if (result.deletedCount === 1) {
        return {success : true};
      } else {
        return {success : false, errorMessage: 'guide not found'};
      }
    }
  },
};
export default resolverMap;