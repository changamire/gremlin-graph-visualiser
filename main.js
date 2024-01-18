$(document).ready(function () {
    var dom = document.getElementById('network');
    myChart = echarts.init(dom);
    nodes = new Map();
    links = new Map();
    categories = [{ name: "Test" }];
    var graph = { nodes: Array.from(nodes.values()), links: Array.from(links.values()), categories: categories };
 
    var option = option = {
        title: {
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function (params) {
                console.log(params);
                var properties = formatProperties(params.data.properties);
                return `Id: ${params.data.id}<br />Label: ${params.data.label}<br /> ${properties}`;
            }
        },
        legend: [
            {
                // selectedMode: 'single',
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [5, 5],
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
                    repulsion: 100,
                    layoutAnimation: true
                },
                label: {
                    show: false,
                    fontSize: 8
                },
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 10
                        }
                    }
                }
            }
        ]
    };
 
    myChart.setOption(option);
    myChart.on('click', function (params) {
        var data = params.data
        getData(data.id);
    });
 
    $("#find").click(function () {
        nodes.clear();
        links.clear();
        getData($("#nodeid").val());
    });
});
 
function getData(nodeId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:3000/graph/neighbours/${nodeId}`,
        dataType: "json",
        success: function (result, status, xhr) {
            result.vertices.forEach(node => {
                if (nodes.get("" + node.id) == null) {
                    nodes.set(node.id, { id: "" + node.id, label: node.label, properties: node.properties, name: node.id, category: getCategoryIndex(node.label) });
                }
            });
            result.edges.forEach(edge => {
                try {
                    if (links.get(edge.id) == null) {
                        links.set(edge.id, { id: edge.label, name: edge.label, source: edge.from.id, target: edge.to.id, label: edge.label, label: {show: true}  });
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            myChart.setOption({ series: [{ data: Array.from(nodes.values()), links: Array.from(links.values()) }] });
        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
 
};
 
function getCategoryIndex(label) {
    if (label.includes("test")) {
        return 0;
    } 
}
 
function formatProperties(properties) {
    var propertiesString = "";
    if (properties != null) {
        for (const [key, value] of Object.entries(properties)) {
            console.log(value);
            propertiesString = propertiesString.concat(`${key}: ${value} <br />`);
        }
    }
    console.log(propertiesString);
    return propertiesString;
}