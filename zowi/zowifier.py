import sys
import bpy
import datetime

body_path = sys.argv[5]
hole_path = sys.argv[6]

b = datetime.datetime.now()

bpy.ops.import_mesh.stl(filepath=hole_path)
bpy.ops.import_mesh.stl(filepath=body_path)

body = bpy.context.scene.objects[0]
hole = bpy.context.scene.objects[1]

boo = body.modifiers.new('Booh', type='BOOLEAN')
boo.operation = 'DIFFERENCE'
boo.object = hole

bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Booh')

bpy.context.scene.objects.unlink(hole)

bpy.ops.export_mesh.stl(filepath=body_path)

e = datetime.datetime.now()

print("Time: {0}".format(e-b))
