import Mesh, Part
from FreeCAD import Base

DOC="Unnamed"

def meshToShape(name):
	name0 = name+"0"
	FreeCAD.getDocument(DOC).addObject("Part::Feature",name0)
	__shape__=Part.Shape()
	__shape__.makeShapeFromMesh(FreeCAD.getDocument(DOC).getObject(name).Mesh.Topology,0.100000)
	FreeCAD.getDocument(DOC).getObject(name0).Shape=__shape__
	FreeCAD.getDocument(DOC).getObject(name0).purgeTouched()
	del __shape__

def shapeSolid(name,shell):
	if shell.ShapeType != 'Shell': raise Exception('Part object is not a shell')
	_=Part.Solid(shell)
	if _.isNull(): raise Exception('Failed to create solid')
	App.ActiveDocument.addObject('Part::Feature','s'+name).Shape=_.removeSplitter()
	del _

def shapeReverse(name,shell):
	__s__=shell.copy()
	__s__.reverse()
	__o__=App.ActiveDocument.addObject("Part::Feature",'r'+name)
	__o__.Shape=__s__
	del __s__, __o__

def loadMeshes(head, hole):
	Mesh.open(head)
	App.setActiveDocument(DOC)
	App.ActiveDocument=App.getDocument(DOC)
	Mesh.insert(hole,DOC)
	
	#-- Convert meshes to shapes
	meshToShape("head")
	meshToShape("hole")

	#-- Make shapes solid
	shapeSolid("head0",App.ActiveDocument.head0.Shape)
	shapeSolid("hole0",App.ActiveDocument.hole0.Shape)

	#-- Reverse shapes
	shapeReverse("shead0",App.ActiveDocument.shead0.Shape)
	shapeReverse("shole0",App.ActiveDocument.shole0.Shape)

def diff():
	App.activeDocument().addObject("Part::Cut","diff")
	App.activeDocument().diff.Base = App.activeDocument().rshead0
	App.activeDocument().diff.Tool = App.activeDocument().rshole0
	App.ActiveDocument.recompute()

def saveMesh(filename):
	__objs__=[]
	__objs__.append(FreeCAD.getDocument(DOC).getObject("diff"))
	Mesh.export(__objs__,filename)
	del __objs__

#-- Main

#- Load meshes
loadMeshes('./uploads/head.stl',
	   './uploads/hole.stl')

#- Make the difference
diff()

#- Save result
saveMesh('./uploads/diff.stl')

