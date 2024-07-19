// AVL Tree Node
class AVLTreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

// AVL Tree
class AVLTree {
    constructor() {
        this.root = null;
    }

    // Helper function to get the height of a node
    getHeight(node) {
        if (node === null) return 0;
        return node.height;
    }

    // Helper function to calculate the balance factor of a node
    getBalanceFactor(node) {
        if (node === null) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    // Rotate right operation
    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    // Rotate left operation
    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    // Insert a value into the AVL Tree
    insert(value) {
        this.root = this.insertNode(this.root, value);
    }

    insertNode(node, value) {
        // Perform normal BST insertion
        if (node === null) {
            return new AVLTreeNode(value);
        }

        if (value < node.value) {
            node.left = this.insertNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.insertNode(node.right, value);
        } else {
            // Duplicate values are not allowed
            return node;
        }

        // Update height of this ancestor node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // Get the balance factor of this ancestor node to check if it became unbalanced
        const balanceFactor = this.getBalanceFactor(node);

        // If unbalanced, perform rotations
        // Left Left Case
        if (balanceFactor > 1 && value < node.left.value) {
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balanceFactor < -1 && value > node.right.value) {
            return this.rotateLeft(node);
        }

        // Left Right Case
        if (balanceFactor > 1 && value > node.left.value) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Left Case
        if (balanceFactor < -1 && value < node.right.value) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        // Return the (unchanged) node pointer
        return node;
    }

    // Delete a value from the AVL Tree
    delete(value) {
        this.root = this.deleteNode(this.root, value);
    }

    deleteNode(node, value) {
        // Perform normal BST deletion
        if (node === null) {
            return node;
        }

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // Node to be deleted found

            // Case 1: Node with only one child or no child
            if (node.left === null || node.right === null) {
                const temp = node.left || node.right;

                // No child case
                if (temp === null) {
                    node = null;
                } else { // One child case
                    node = temp;
                }
            } else {
                // Case 2: Node with two children
                // Get the inorder successor (smallest in the right subtree)
                const temp = this.findMinNode(node.right);
                node.value = temp.value;
                node.right = this.deleteNode(node.right, temp.value);
            }
        }

        // If the tree had only one node then return
        if (node === null) {
            return node;
        }

        // Update the height of the current node
        node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

        // Get the balance factor of this node to check whether this node became unbalanced
        const balanceFactor = this.getBalanceFactor(node);

        // If the node becomes unbalanced, then there are 4 cases

        // Left Left Case
        if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
            return this.rotateRight(node);
        }

        // Left Right Case
        if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
            node.left = this.rotateLeft(node.left);
            return this.rotateRight(node);
        }

        // Right Right Case
        if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
            return this.rotateLeft(node);
        }

        // Right Left Case
        if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
            node.right = this.rotateRight(node.right);
            return this.rotateLeft(node);
        }

        return node;
    }

    // Search for a value in the AVL Tree
    search(value) {
        return this.searchNode(this.root, value);
    }

    searchNode(node, value) {
        if (node === null || node.value === value) {
            return node;
        }

        if (value < node.value) {
            return this.searchNode(node.left, value);
        } else {
            return this.searchNode(node.right, value);
        }
    }

    // Helper function to find the node with minimum value in a subtree
    findMinNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // Visualize AVL Tree
    visualizeTree(root, highlightNode = null) {
        const svg = d3.select("#tree-visualization").html("").append("svg")
            .attr("width", 960)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(40,40)");

        const treeLayout = d3.tree().size([880, 400]);

        const rootD3 = d3.hierarchy(root, d => {
            return d ? [d.left, d.right].filter(n => n !== null) : [];
        });

        treeLayout(rootD3);

        const link = svg.selectAll(".link")
            .data(rootD3.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
            });

        const node = svg.selectAll(".node")
            .data(rootD3.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

        node.append("circle")
            .attr("r", 20)
            .style("fill", d => d.data === highlightNode ? "lightgreen" : "lightblue")
            .style("stroke", "steelblue")
            .style("stroke-width", "2px");

        node.append("text")
            .attr("dy", 3)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .text(d => d.data.value);
    }
}

// AVL Tree instance
const avlTree = new AVLTree();

// Event handlers for buttons
function insertNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        avlTree.insert(value);
        avlTree.visualizeTree(avlTree.root);
    }
}

function deleteNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        avlTree.delete(value);
        avlTree.visualizeTree(avlTree.root);
    }
}

function searchNode() {
    const value = parseInt(document.getElementById('value').value);
    if (!isNaN(value)) {
        const node = avlTree.search(value);
        if (node) {
            avlTree.visualizeTree(avlTree.root, node);
        } else {
            alert("Node not found");
        }
    }
}
