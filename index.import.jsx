import Tree from './tree.import';
import Node from './node.import';

export default React.createClass({
    displayName: 'UITree',

    propTypes: {
        tree: React.PropTypes.object.isRequired,
        paddingLeft: React.PropTypes.number,
        renderNode: React.PropTypes.func.isRequired
    },

    getDefaultProps () {

        return {
            paddingLeft: 20
        };
    },

    getInitialState () {
        return this.init(this.props);
    },

    componentWillReceiveProps (nextProps) {
        if (!this._updated) this.setState(this.init(nextProps));
        else this._updated = false;
    },

    init (props) {
        let eventsNames = eventsFor.mouse;
        if (isTouchSupported()) {
            eventsNames = eventsFor.touch;
        }
        var tree = new Tree(props.tree);
        tree.isNodeCollapsed = props.isNodeCollapsed;
        tree.renderNode = props.renderNode;
        tree.changeNodeCollapsed = props.changeNodeCollapsed;
        tree.updateNodesPosition();

        return {
            tree: tree,
            eventsNames,
            dragging: {
                id: null,
                x: null,
                y: null,
                w: null,
                h: null,
                ctrlKey: null,
                metaKey: null,
                altKey: null
            }
        };
    },

    getDraggingDom () {
        var tree = this.state.tree;
        var dragging = this.state.dragging;

        if (dragging && dragging.id) {
            let draggingIndex = tree.getIndex(dragging.id);
            let draggingStyles = {
                top: dragging.y,
                left: dragging.x,
                width: dragging.w
            };

            return (
                <div className="m-draggable" style={draggingStyles}>
                    <Node
                        tree={tree}
                        index={draggingIndex}
                        paddingLeft={this.props.paddingLeft}
                        />
                </div>
            );
        }

        return null;
    },

    render () {
        var tree = this.state.tree;
        var dragging = this.state.dragging;
        var draggingDom = this.getDraggingDom();

        return (
            <div className="m-tree">
                {draggingDom}
                <Node
                    tree={tree}
                    index={tree.getIndex(1)}
                    key={1}
                    paddingLeft={this.props.paddingLeft}
                    onDragStart={this.dragStart}
                    onCollapse={this.toggleCollapse}
                    dragging={dragging && dragging.id}
                    />
            </div>
        );
    },

    dragStart (id, dom, e) {
        this.dragging = {
            id: id,
            w: dom.offsetWidth,
            h: dom.offsetHeight,
            x: dom.offsetLeft,
            y: dom.offsetTop,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            altKey: e.altKey
        };

        this._startX = dom.offsetLeft;
        this._startY = dom.offsetTop;
        this._offsetX = e.clientX;
        this._offsetY = e.clientY;
        this._start = true;

        window.addEventListener(this.state.eventsNames.move, this.drag);
        window.addEventListener(this.state.eventsNames.end, this.dragEnd);
    },

    // oh
    drag (e) {
        if (this._start) {
            this.setState({
                dragging: this.dragging
            });
            this._start = false;
        }

        var tree = this.state.tree;
        var dragging = this.state.dragging;
        var paddingLeft = this.props.paddingLeft;
        var newIndex = null;
        var index = tree.getIndex(dragging.id);
        var collapsed = index.node.collapsed;

        var _startX = this._startX;
        var _startY = this._startY;
        var _offsetX = this._offsetX;
        var _offsetY = this._offsetY;

        var pos = {
            x: _startX + e.clientX - _offsetX,
            y: _startY + e.clientY - _offsetY
        };
        dragging.x = pos.x;
        dragging.y = pos.y;

        var diffX = dragging.x - paddingLeft / 2 - (index.left - 2) * paddingLeft;
        var diffY = dragging.y - dragging.h / 2 - (index.top - 2) * dragging.h;

        if (diffX < 0) { // left
            if (index.parent && !index.next) {
                newIndex = tree.move(index.id, index.parent, 'after');
            }
        } else if (diffX > paddingLeft) { // right
            if (index.prev) {
                let prevNode = tree.getIndex(index.prev).node;
                if (!prevNode.collapsed && !prevNode.leaf) {
                    newIndex = tree.move(index.id, index.prev, 'append');
                }
            }
        }

        if (newIndex) {
            index = newIndex;
            newIndex.node.collapsed = collapsed;
            dragging.id = newIndex.id;
        }

        if (diffY < 0) { // up
            let above = tree.getNodeByTop(index.top - 1);
            newIndex = tree.move(index.id, above.id, 'before');
        } else if (diffY > dragging.h) { // down
            if (index.next) {
                let below = tree.getIndex(index.next);
                if (below.children && below.children.length && !below.node.collapsed) {
                    newIndex = tree.move(index.id, index.next, 'prepend');
                } else {
                    newIndex = tree.move(index.id, index.next, 'after');
                }
            } else {
                let below = tree.getNodeByTop(index.top + index.height);
                if (below && below.parent !== index.id) {
                    if (below.children && below.children.length) {
                        newIndex = tree.move(index.id, below.id, 'prepend');
                    } else {
                        newIndex = tree.move(index.id, below.id, 'after');
                    }
                }
            }
        }

        if (newIndex) {
            newIndex.node.collapsed = collapsed;
            dragging.id = newIndex.id;
        }

        this.setState({
            tree: tree,
            dragging: dragging
        });
    },

    dragEnd () {
        let dragging = this.state.dragging;
        this.setState({
            dragging: {
                id: null,
                x: null,
                y: null,
                w: null,
                h: null,
                ctrlKey: null,
                metaKey: null,
                altKey: null
            }
        });
        this.change(this.state.tree, dragging);
        window.removeEventListener(this.state.eventsNames.move, this.drag);
        window.removeEventListener(this.state.eventsNames.end, this.dragEnd);
    },

    change (tree, dragging) {
        this._updated = true;
        if (this.props.onChange) this.props.onChange(tree.obj, dragging);
    },

    toggleCollapse (nodeId) {
        var tree = this.state.tree;
        var index = tree.getIndex(nodeId);
        var node = index.node;
        node.collapsed = !node.collapsed;
        tree.updateNodesPosition();

        this.setState({
            tree: tree
        });
        if(typeof this.props.onCollapsed === 'function'){
            this.props.onCollapsed(index.node._id);
        }
        this.change(tree);
    }
});


function isTouchSupported () {
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = 'ontouchstart' in document.createElement('div');
    return (msTouchEnabled || generalTouchEnabled);
}


var eventsFor = {
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
    },
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    }
};