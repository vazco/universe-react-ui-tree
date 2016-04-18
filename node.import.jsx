import {classNames} from '{universe:utilities-react}';

var Node = React.createClass({
    displayName: 'UITreeNode',

    renderCollapse () {
        var index = this.props.index;

        if (index.children && index.children.length) {
            let collapsed = index.node.collapsed;

            return (
                <span
                    className={classNames('collapse', collapsed ? 'caret-left' : 'caret-down')}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={this.handleCollapse}>
        </span>
            );
        }

        return null;
    },

    renderChildren () {
        var index = this.props.index;
        var tree = this.props.tree;
        var dragging = this.props.dragging;
        var childrenStyles = {};

        if (index.children && index.children.length) {
            if (index.node.collapsed) childrenStyles.display = 'none';
            childrenStyles['paddingLeft'] = this.props.paddingLeft + 'px';

            return (
                <div className="children" style={childrenStyles}>
                    {index.children.map((child) => {
                        var childIndex = tree.getIndex(child);
                        return (
                            <Node
                                tree={tree}
                                index={childIndex}
                                key={childIndex.id}
                                dragging={dragging}
                                paddingLeft={this.props.paddingLeft}
                                onCollapse={this.props.onCollapse}
                                onDragStart={this.props.onDragStart}
                                />
                        );
                    })}
                </div>
            );
        }

        return null;
    },

    render () {
        var tree = this.props.tree;
        var index = this.props.index;
        var dragging = this.props.dragging;
        var node = index.node;
        var styles = {};
        var prs = {};
        if (isTouchSupported()) {
            prs.onTouchStart = this.handleMouseDown;
        } else {
            prs.onMouseDown = this.handleMouseDown;
        }

        return (
            <div className={classNames('m-node', {
                placeholder: index.id === dragging
            })} style={styles}>

                <div className="inner" ref="inner" onTouchStart={prs.onTouchStart} onMouseDown={prs.onMouseDown}>
                    {tree.renderNode(node)}
                    {this.renderCollapse()}
                </div>
                {this.renderChildren()}
            </div>
        );
    },

    handleCollapse (e) {
        e.stopPropagation();
        var nodeId = this.props.index.id;
        if (this.props.onCollapse) this.props.onCollapse(nodeId);
    },

    handleMouseDown (e) {
        var nodeId = this.props.index.id;
        var dom = this.refs.inner;

        if (this.props.onDragStart) {
            this.props.onDragStart(nodeId, dom.getDOMNode ? dom.getDOMNode() : dom, e);
        }
    }
});
function isTouchSupported () {
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = 'ontouchstart' in document.createElement('div');

    return (msTouchEnabled || generalTouchEnabled);
}
export default Node;
