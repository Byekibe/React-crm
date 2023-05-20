import Client from '../models/Client.js';
import Project from '../models/Project.js'
// import { projects, clients } from '../sampleData.js';
import { 
    GraphQLEnumType,
    GraphQLID, 
    GraphQLList, 
    GraphQLNonNull, 
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
                return Client.findById(parent.clientId);
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
            args: { id: {type: GraphQLID} },
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
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) }
            },

            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });

                return client.save();
            }
        },

        deleteClient: {
            type: ClientType,
            args: { id: { type: GraphQLNonNull(GraphQLID) }},
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            } 
        },

        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                clientId: { type: GraphQLNonNull(GraphQLID) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                        new: {value: 'Not Started'},
                        progress: {value: 'In Progress'},
                        completed: {value: 'Completed'}
                    },
                    }),
                    defaultValue: 'Not Started',
                },

            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    clientId: args.clientId,
                    status: args.status
                });

                return project.save();
            }
        },

        deleteProject: {
            type: ProjectType,
            args: { id: {type: GraphQLNonNull(GraphQLID)} },
            resolve(parent, args) {
                return Project.findByIdAndRemove(args.id);
            }
        },

        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID)},
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            new: { value: 'Not Started' },
                            progress: { value: 'In Progress' },
                            completed: { value: 'Completed' }
                        }
                    }),
                    defaultValue: 'Not Started'
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    },
                    { new: true}
                );
            }
        }
    }
})

export default new GraphQLSchema({
    query: RootQuery,
    mutation
})