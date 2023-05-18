import Client from '../models/Client.js';
import Project from '../models/Project.js'
// import { projects, clients } from '../sampleData.js';
import { 
    GraphQLID, 
    GraphQLList, 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString 
} from "graphql";

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description:{ type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.find(parent.clientId);
            }
        }
    })
});

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find();
            }
        },
        
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Client.find(args.id);
            }
        },

        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find();
            }
        },

        project: {
            type: ProjectType,
            args: { id: GraphQLID },
            resolve(parent, args) {
                return Project.find(args.id);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString }
            },

            resolve(parent, args) {
                const client = {
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                };

                
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation
})