import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import cheerio from 'cheerio';

const selector = {
  type: GraphQLString,
  description: 'DOM element selector'
};

const Node = new GraphQLObjectType({
  name: 'Node',
  fields() {
    return {
      text: {
        type: GraphQLString,
        args: { selector },
        resolve(root, args) {
          if (args.selector) {
            return cheerio(args.selector, root).text();
          }
          return cheerio(root).text();
        }
      },
      attr: {
        type: GraphQLString,
        args: {
          name: {
            type: GraphQLString,
            description: 'Name of needed attribute'
          },
          selector
        },
        resolve(root, args) {
          if (args.selector) {
            return cheerio(args.selector, root).attr(args.name);
          }
          return cheerio(root).attr(args.name);
        }
      },
      next: {
        type: Node,
        args: { selector },
        resolve(root, args) {
          if (args.selector) {
            return cheerio(args.selector, root).next();
          }
          return cheerio(root).next();
        }
      },
      nextAll: {
        type: new GraphQLList(Node),
        args: { selector },
        resolve(root, args) {
          const items = root(args.selector);
          const arr = [];
          items.each((i, item) => {
            arr.push(item);
          });
          return arr;
        }
      },
      tag: {
        type: GraphQLString,
        args: { selector },
        resolve(root, args) {
          if (args.selector) {
            return cheerio(args.selector, root).get(0).tagName;
          }
          return cheerio(root).get(0).tagName;
        }
      },
      html: {
        type: GraphQLString,
        args: { selector },
        resolve(root, args) {
          if (args.selector) {
            return cheerio(args.selector, root).html();
          }
          return cheerio(root).html();
        }
      },
      parent: {
        type: Node,
        resolve(root) {
          return cheerio(root).parent();
        }
      },
      query: {
        type: new GraphQLList(Node),
        args: { selector },
        resolve(root, args) {
          const items = cheerio(args.selector, root);
          const arr = [];
          items.each((i, item) => {
            arr.push(item);
          });
          return arr;
        }
      }
    };
  }
});

export default Node;
