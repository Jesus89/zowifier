import sys
import bpy
import datetime

body_path = sys.argv[5]
hole_path = sys.argv[6]
shell_path = sys.argv[7]

b = datetime.datetime.now()

#- Import STL meshes
bpy.ops.import_mesh.stl(filepath=shell_path)
bpy.ops.import_mesh.stl(filepath=hole_path)
bpy.ops.import_mesh.stl(filepath=body_path)

#- Load objects
body = bpy.context.scene.objects[0]
hole = bpy.context.scene.objects[1]
shell = bpy.context.scene.objects[2]

#- Union with shell
boo = body.modifiers.new('UBS', type='BOOLEAN')
boo.operation = 'UNION'
boo.object = shell
bpy.ops.object.modifier_apply(apply_as='DATA', modifier='UBS')
bpy.context.scene.objects.unlink(shell)

#- Difference with hole
boo = body.modifiers.new('DBH', type='BOOLEAN')
boo.operation = 'DIFFERENCE'
boo.object = hole
bpy.ops.object.modifier_apply(apply_as='DATA', modifier='DBH')
bpy.context.scene.objects.unlink(hole)

#- Export STL mesh
bpy.ops.export_mesh.stl(filepath=body_path)

e = datetime.datetime.now()

print("Time: {0}".format(e-b))
