import { IResolvers } from 'graphql-tools';
import _ from 'lodash';
import * as typeDefs from './schema/schema.graphql';
import UserModel from '../model/User';
import GuideModel from '../model/Guide';
import SiteModel from '../model/Site';
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
    },
    listSites(ignore: void, args: void, context: any): Promise <any[]> {
      if(_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      return SiteModel.find().exec();
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
    },
    createSite: async (parent, {site}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // generate UUID - Mongoose handles this for us I believe
  
      const nSite = await SiteModel.create(site);
      return nSite?.toJson();
    },
    deleteSite: async (parent, {siteURL}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      const result = await SiteModel.deleteOne({siteURL});
      if (result.deletedCount === 1) {
        return {success : true};
      } else {
        return {success : false, errorMessage: 'site not found'};
      }
    },
    deleteUser: async (parent, {email}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      const result = await UserModel.deleteOne({'local.email':  email});
      if (result.deletedCount === 1) {
        return {success : true};
      } else {
        return {success : false, errorMessage: 'user not found'};
      }
    },
    createUser: async (parent, {user}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // generate UUID - Mongoose handles this for us I believe

      const nUser = await UserModel.create(user);
      return nUser?.toLocalJson();
    },
    updateUser: async (parent, {user}, context) => {
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // TODO: Validation, also may need to adjust query
      await UserModel.updateOne({_id: user.id}, {name: user.name});
      const nUser = await UserModel.findOne({_id: user.id});
      // NOTE: For now we return null if no user is found, we probably should throw an error.
      return nUser?.toLocalJson();
    },
    changePassword: async (parent, {oldPassword, newPassword}, context) => {
      const currentUser = context.getUser();
      if (_.isUndefined(context.getUser())) {
        throw new AuthenticationError('must authenticate');
      }
      // TODO: Validation, also may need to adjust query
      const nUser = await UserModel.findOne({_id: currentUser.id});
      if (nUser.validPassword(oldPassword)) {
         nUser.changePassword(newPassword);
         await nUser.save();
      }
    }
  }
  

};
export default resolverMap;