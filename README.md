<h1 align="center">
    <a href="https://github.com/vazco">vazco</a>/Universe React UI Tree
</h1>

&nbsp;

<h3 align="center">
  -- Abandonware. This package is deprecated! --
</h3>

&nbsp;

React tree component

<img src="https://raw.githubusercontent.com/vazco/universe-react-ui-tree/master/view.jpg"/>

### Installation
``` sh
meteor add universe:react-ui-tree
//if you don't have yet:
meteor add universe:modules
```
### Usage
``` javascript
import Tree from '{universe:react-ui-tree}';
<Tree
  paddingLeft={20}              // left padding for children nodes in pixels
  tree={this.state.tree}        // tree object
  onChange={this.handleChange}  // onChange(tree, draggingData) tree object changed
  renderNode={this.renderNode}  // renderNode(item) return react element
/>

// draggingData looks like:

-  id: A identificator of dragging
-  x: coordination in x-axis,
-  y: coordination in y-axis,
-  w: wight,
-  h: height,
-  ctrlKey: if ctrl key was pressed on dragging start,
-  metaKey: if meta key was pressed on dragging start,
-  altKey: if alt was pressed on dragging start

// a sample tree object
// node.children, node.collapsed, node.leaf properties are hardcoded
{
  title: "Pages",
  children: [{
    collapsed: true,
    title: "Doc one",
    children: [{
      _id: "abclkfdkjfdjk",
      title: "Doc two"
    }]
  }]
}
```

### License

Made based on npm package pqx/react-ui-tree (not just adapted).

<img src="https://vazco.eu/banner.png" align="right">

**Like every package maintained by [Vazco](https://vazco.eu/), Universe React UI Tree is [MIT licensed](https://github.com/vazco/uniforms/blob/master/LICENSE).**
