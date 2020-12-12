/*
Title: Automata(DFA, NFA) Simulator
Author: Mohammad Imam Hossain
Date: 12/12/2020
All rights reserved.
*/

(function(){
    /// variable initialization
    var states=0;
    var transitions=0;

    ///color settings
    var stateColor='#ffc299';
    var borderandtextColor="#ff6600";
    var labelbgColor='#fff0e6';
    var stateSize=20;

    ///initializing the sigma graph
    var myGraph=new sigma.classes.graph();
    myGraph.read({
        nodes:[],
        edges:[]
    });

    ///initilizing sigma with default renderer
    var s=new sigma({
        id: 'sigmaapp',
        renderers: [
            {
                container: document.getElementById('graph-container'),
                type: 'canvas',
            }
        ],
        graph: myGraph,
        settings:{
            autoRescale: false,
            doubleClickEnabled: false,
            enableCamera: false, /// disabling the camera so that co-ordinate system remains stable
            enableEdgeHovering: true, ///the edges can be hovered to display special rendering adn detial text
            edgeHoverExtremities: true,

            defaultLabelColor: borderandtextColor, // to change the label color
            defaultLabelSize: 24, // to change the label size
            defaultLabelHoverColor: borderandtextColor, // the default text color of hovered labels
            defaultHoverLabelBGColor: labelbgColor, // default background color of hovered nodes labels

            defaultNodeColor: stateColor, // to change the node color
            borderSize: 2, // the size of the border of hovered nodes
            defaultNodeBorderColor: 'transparent',

            defaultEdgeColor: borderandtextColor,
            edgeColor: 'default',
            maxEdgeSize: 4,
            defaultEdgeHoverColor: '#803300',
            edgeHoverColor: 'default',

            defaultEdgeLabelColor: borderandtextColor,
            defaultEdgeLabelSize: 20,
        }
    });

    ///-------------------------------state creation-----------------------------------
    /// creating new node on a single click in the stage area
    s.bind('clickStage', createnewstate);
    function createnewstate(e){
        console.log('creating new node ... ...');
        console.log(e);

        ///click position
        var clickx=e.data.captor.x;
        var clicky=e.data.captor.y;

        /// creating the new state
        var stateid='q'+states;

        s.graph.addNode({
            id: stateid,
            label: stateid, ///initially id and label both are same
            x: clickx,
            y: clicky,
            size: stateSize,
            type: 'def'
        });

        console.log('new node created');
        console.log(s.graph.nodes());
        ++states; /// incrementing nodes count
        s.refresh(); /// refreshing the canvas
    }

    /// updating the node label or, node deletion
    s.bind('rightClickNode', showmodal);
    function showmodal(e){
        console.log('node clicked for update or deletion');
        console.log(e);

        var nodeid=e.data.node.id;
        document.getElementById('nodeid').value=nodeid;
        document.getElementById('statename').value=e.data.node.label;

        var statetype=e.data.node.type;
        if(statetype=='bothstate' || statetype=='startstate') document.getElementById('start-state').checked=true;
        if(statetype=='bothstate' || statetype=='finalstate') document.getElementById('final-state').checked=true;

        ///showing the modal
        $('#statemodal').modal('show');
    }

    /// updating the node when update button is clicked from the modal
    document.getElementById('updatestate').addEventListener('click',updatestate);
    function updatestate(e){
        console.log('state update event');
        console.log(e);

        /// receiving state type
        var isstart=document.getElementById('start-state').checked;
        var isfinal=document.getElementById('final-state').checked;
        console.log(isstart+" , "+isfinal);

        var statetype='def'; /// initializing with default state
        if(isstart && isfinal){
            statetype='bothstate';
        }
        else if(isstart && !isfinal){
            statetype='startstate';
        }
        else if(!isstart && isfinal){
            statetype='finalstate';
        }

        /// receiving state label
        var newstatelabel=document.getElementById('statename').value;
        var nodeid=document.getElementById('nodeid').value;

        ///updating state properties
        var allnodes=s.graph.nodes();
        for(var ind in allnodes){
            var tmpstate=allnodes[ind];
            if(tmpstate.id==nodeid){
                tmpstate.label=newstatelabel;
                tmpstate.type=statetype;
            }
        }

        console.log('update successfull');
        console.log(s.graph.nodes());
        s.refresh();

        ///resetting the modal
        resetmodal();
    }

    /// deleting the state when delete button is clicked within the modal
    document.getElementById('deletestate').addEventListener('click',deletestate);
    function deletestate(e){
        console.log('state delete event');
        console.log(e);

        var nodeid=document.getElementById('nodeid').value;

        s.graph.dropNode(nodeid);
        console.log('state deletion successful');
        console.log(s.graph.nodes());
        s.refresh();

        ///resetting the modal
        resetmodal();
    }

    function resetmodal(){
        /// resetting all the modal fields
        document.getElementById('start-state').checked=false;
        document.getElementById('final-state').checked=false;
        document.getElementById('statename').value="";
    }

    ///rendering start state
    sigma.canvas.nodes.startstate=function(node, context, settings){
        var prefix=settings('prefix') || '';
        var size=node[prefix+'size'];

        context.fillStyle=node.color||settings('defaultNodeColor');
        context.strokeStyle=borderandtextColor;
        context.lineWidth=2;

        context.beginPath();
        context.moveTo(node[prefix+'x']-size*3,node[prefix+'y']);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.moveTo(node[prefix+'x']-size-8,node[prefix+'y']-8);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.moveTo(node[prefix+'x']-size-8,node[prefix+'y']+8);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.moveTo(node[prefix+'x'],node[prefix+'y']);
        context.arc(
            node[prefix+'x'],
            node[prefix+'y'],
            size,
            0,
            Math.PI*2
        );
        context.closePath();
        context.fill();
    };

    ///rendering final state
    sigma.canvas.nodes.finalstate=function(node, context, settings){
        var prefix=settings('prefix') || '';
        var size=node[prefix+'size'];

        context.fillStyle=node.color||settings('defaultNodeColor');
        context.strokeStyle=borderandtextColor;
        context.lineWidth=2;

        context.beginPath();
        context.arc(
            node[prefix+'x'],
            node[prefix+'y'],
            size-3.5,
            0,
            Math.PI*2
        );
        context.stroke();
        context.fill();

        // context.beginPath();
        // context.arc(
        //     node[prefix+'x'],
        //     node[prefix+'y'],
        //     size-4,
        //     0,
        //     Math.PI*2
        // );
        // context.stroke();

        /// outer circle
        context.beginPath();
        context.arc(
            node[prefix+'x'],
            node[prefix+'y'],
            size,
            0,
            Math.PI*2
        );
        context.stroke();
    };

    ///rendering both state
    sigma.canvas.nodes.bothstate=function(node, context, settings){
        var prefix=settings('prefix') || '';
        var size=node[prefix+'size'];

        context.fillStyle=node.color||settings('defaultNodeColor');
        context.strokeStyle=borderandtextColor;
        context.lineWidth=2;

        context.beginPath();
        context.moveTo(node[prefix+'x']-size*3,node[prefix+'y']);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.moveTo(node[prefix+'x']-size-8,node[prefix+'y']-8);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.moveTo(node[prefix+'x']-size-8,node[prefix+'y']+8);
        context.lineTo(node[prefix+'x']-size,node[prefix+'y']);
        context.stroke();

        context.beginPath();
        context.arc(
            node[prefix+'x'],
            node[prefix+'y'],
            size-3.5,
            0,
            Math.PI*2
        );
        context.stroke();
        context.fill();

        /// outer circle
        context.beginPath();
        context.arc(
            node[prefix+'x'],
            node[prefix+'y'],
            size,
            0,
            Math.PI*2
        );
        context.stroke();
    };

    ///------------------------------------edge creation-------------------------------

    /// edge creating operation
    var clickcounter=0;
    var prevnodeid=-1;
    s.bind('doubleClickNode',function(e){
        console.log('node selected');
        console.log(event);

        var nodeid=e.data.node.id;

        ++clickcounter;
        if(clickcounter==1){
            prevnodeid=nodeid;
            ///updating state properties
            var allnodes=s.graph.nodes();
            for(var ind in allnodes){
                var tmpstate=allnodes[ind];
                if(tmpstate.id==nodeid){
                    tmpstate.color='#b34700';
                }
            }
            s.refresh();
        }
        else if(clickcounter==2){

            ///reverseedge check
            var isreverse=false;
            var alledges=s.graph.edges();
            for(var ind in alledges){
                var tmpedge=alledges[ind];
                if(tmpedge.source==nodeid && tmpedge.target==prevnodeid){
                    tmpedge.type="curvedArrow";
                    isreverse=true;
                    break;
                }
            }

            ///adding new edge
            var edgeid='t'+transitions;
            var edgelabel=String.fromCharCode(949);
            var edgetype='arrow';
            if(prevnodeid==nodeid || isreverse==true){
                edgetype='curvedArrow';
            }


            s.graph.addEdge({
                id: edgeid,
                label: edgelabel,
                source: prevnodeid,
                target: nodeid,
                size: 3,
                type: edgetype
            });
            ++transitions; ///increment 1 transitions

            ///setting previous state color to source state
            var allnodes=s.graph.nodes();
            for(var ind in allnodes){
                var tmpstate=allnodes[ind];
                if(tmpstate.id==prevnodeid){
                    tmpstate.color=stateColor;
                }
            }

            s.refresh();
            console.log('New edge added ... ...');

            clickcounter=0; /// returning back to initial position
            prevnodeid=-1; /// returning back to initial previous node id
        }
    });

    /// edge edit or delete operation
    s.bind('rightClickEdge', showedgemodal);
    function showedgemodal(e){
        console.log('edge clicked for update or delete');
        console.log(e);

        var edgeid=e.data.edge.id;
        document.getElementById('edgeid').value=edgeid;

        document.getElementById('edgelabel').value=e.data.edge.label;

        ///showing the modal
        $('#edgemodal').modal('show');
    }

    ///epsilon generator
    document.getElementById('edgelabel').addEventListener('keyup', printepsilon);
    function printepsilon(e){
        var curval=e.target.value;
        var newcurval=curval.replace(/<ep>/g, String.fromCharCode(949));
        e.target.value=newcurval;
    }

    /// updating the transition label when update button is clicked
    document.getElementById('updateedge').addEventListener('click', updateedgelabel);
    function updateedgelabel(e){
        console.log('update edge button clicked');
        console.log(e);

        var newedgelabel=document.getElementById('edgelabel').value;
        if(newedgelabel==''){
            newedgelabel=String.fromCharCode(949); ///for empty label, default label = epsilon
        }

        var edgeid=document.getElementById('edgeid').value;
        var alledges=s.graph.edges();
        for(var ind in alledges){
            var tmpedge=alledges[ind];
            if(tmpedge.id==edgeid){
                tmpedge.label=newedgelabel;
                break;
            }
        }

        s.refresh();
        console.log('transition label updated');
        ///resetting the modal fields
        resetedgemodal();
    }

    function resetedgemodal(){
        document.getElementById('edgeid').value="";
        document.getElementById('edgelabel').value="";
    }

    /// deleting teh transition edge when delete button is clicked
    document.getElementById('deleteedge').addEventListener('click',deleteedge);
    function deleteedge(e){
        console.log('delete edge clicked');
        console.log(e);

        s.refresh(); // first refreshing otherwise an error occurs

        ///deletion operation
        var edgeid=document.getElementById('edgeid').value;

        try{
            ///dropping edges now
            console.log(s.graph.edges());
            s.graph.dropEdge(edgeid);
            console.log(s.graph.edges());

            s.refresh();
            console.log('edge deletion successful.');
        }
        catch(err){
            console.log('edge deletion error');
        }

        resetedgemodal();
    }

    ///---------------------------------dragging nodes--------------------------------

    // Initialize the dragNodes plugin:
    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

    dragListener.bind('startdrag', function(event) {
      console.log(event);
    });
    dragListener.bind('drag', function(event) {
      console.log(event);
    });
    dragListener.bind('drop', function(event) {
      console.log(event);
    });
    dragListener.bind('dragend', function(event) {
      console.log(event);
    });

    ///--------------------formal definition generation----------------------------
    document.getElementById('generatebtn').addEventListener('click',generateformaldef);
    function generateformaldef(e){
        var basicgraph=s.graph;
        console.log(basicgraph);

        var allstates=s.graph.nodes();
        var alltransitions=s.graph.edges();

        if(allstates.length>0){
            var startstatecount=0;

            ///showing component 1,4,5
            var comp1arr=[];
            var comp4string="";
            var comp5arr=[];
            for(var ind in allstates){
                var tmpstate=allstates[ind];
                comp1arr.push(tmpstate.label);

                ///testing start state
                if(tmpstate.type=='startstate' || tmpstate.type=='bothstate'){
                    comp4string=tmpstate.label;
                    startstatecount++;
                }

                ///testing final state
                if(tmpstate.type=='finalstate'  || tmpstate.type=='bothstate'){
                    comp5arr.push(tmpstate.label);
                }
            }

            if(startstatecount==1){
                document.getElementById('comp1').innerText=comp1arr.join(' , ');
                document.getElementById('comp4').innerText=comp4string;
                document.getElementById('comp5').innerText=comp5arr.join(' , ');;

                ///showing components 2,3
                var comp2arr=[];
                for(var ind in alltransitions){
                    var tmpedge=alltransitions[ind];

                    var edgelabel=tmpedge.label;
                    var tmparr=edgelabel.split(','); ///splitting all indivisual alphabets

                    comp2arr=comp2arr.concat(tmparr);
                }

                ///comp2arr contains repeated alphabets
                ///finding out unique components
                var uniquearr = comp2arr.filter((item, i, ar) => ar.indexOf(item) === i);
                ///removing epsilon and any empty characters
                var uniquearr1 = uniquearr.filter((item,i,ar) => (item==String.fromCharCode(949) || item=="") ? false : true);
                ///sorting the alphabet set
                uniquearr1.sort();
                var comp2string=uniquearr1.join(' , ');
                console.log(comp2string);
                document.getElementById('comp2').innerText=comp2string;

                ///generating transition table here
                var norows=allstates.length;
                var nocols=uniquearr1.length;
                var isepsilon=false;
                console.log(norows+" "+nocols);

                var tablestring="";
                tablestring+="<table class='table table-striped'>";
                    ///writing table heading section
                    tablestring+="<thead><tr>";
                        ///adding first empty column
                        tablestring+="<th></th>";
                        ///adding 1 column per alhapbet symbol
                        for(var ind in uniquearr1){
                            tablestring+="<th>"+uniquearr1[ind]+"</th>";
                        }
                        ///creating epsilon column if needed
                        ///remember: uniquearr1 contains no epsilon and empty string
                        ///so we need uniquearr variable only
                        if(uniquearr.indexOf(String.fromCharCode(949))!=-1){
                            isepsilon=true;
                            tablestring+="<th>"+String.fromCharCode(949)+"</th>";
                        }
                    tablestring+="</tr></thead>";

                    ///writing table body section
                    tablestring+="<tbody>";
                        ///adding rows for each state
                        for(var ind in allstates){
                            var tmpstid=allstates[ind].id;
                            tablestring+="<tr>";
                                tablestring+="<th>"+comp1arr[ind]+"</th>";
                                for(var i=0;i<nocols;i++){
                                    tablestring+="<td>{ <span id='cell_"+tmpstid+"_"+uniquearr1[i]+"'></span> }</td>";
                                }
                                if(isepsilon==true){
                                    var curcellid="cell_"+tmpstid;
                                    tablestring+="<td>{ <span id='"+curcellid+"'></span> }</td>";
                                }
                            tablestring+="</tr>";
                        }
                    tablestring+="</tbody>";

                tablestring+="</table>";
                console.log(tablestring);
                document.getElementById('comp3').innerHTML=tablestring;

                ///traversing all the edges
                for(var ind in alltransitions){
                    var tmpedge=alltransitions[ind];
                    var tmplabel=tmpedge.label;
                    var src=tmpedge.source;  ///this returns only node id
                    var srclabel=src;
                    var dest=tmpedge.target; /// this returns only node id
                    var destlabel=dest;
                    for(var ind1 in allstates){
                        var tmp1state=allstates[ind1];
                        if(tmp1state.id==dest){
                            destlabel=tmp1state.label;
                            break;
                        }
                    }

                    console.log(tmplabel+" "+src+" "+dest);

                    var chars=tmplabel.split(',');
                    console.log(chars);
                    for(var ind1 in chars){
                        ///generating html table cell id to edit
                        var cellid="cell_"+src;

                        var tmpsymbol=chars[ind1];
                        if(tmpsymbol!=String.fromCharCode(949)) cellid+="_"+tmpsymbol;

                        var cell=document.getElementById(cellid);
                        console.log(cellid);
                        console.log(cell);
                        var curcontent=cell.innerText;
                        if(curcontent=="") curcontent+=destlabel;
                        else curcontent+=" , "+destlabel;

                        cell.innerText="";
                        var curcontentarr=curcontent.split(' , ');
                        curcontentarr.sort();
                        curcontent=curcontentarr.join(' , ');
                        cell.innerText=curcontent;
                    }
                }
            }
            else{
                if(startstatecount>1) window.alert("Invalid state diagram. More than 1 start state exists ... ...");
                else if(startstatecount==0) window.alert("No Start state defined ... ...");
            }
        }
        else{
            window.alert("Invalid State Diagram.");
        }
    }

})();
