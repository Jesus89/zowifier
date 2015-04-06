import bpy

import datetime

b = datetime.datetime.now()

bpy.ops.import_mesh.stl(filepath="./zowi/hole.stl")
bpy.ops.import_mesh.stl(filepath="./uploads/body.stl")

body = bpy.context.scene.objects[0]
hole = bpy.context.scene.objects[1]

boo = body.modifiers.new('Booh', type='BOOLEAN')
boo.operation = 'DIFFERENCE'
boo.object = hole

bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Booh')

bpy.context.scene.objects.unlink(hole)

bpy.ops.export_mesh.stl(filepath="./uploads/body.stl")

e = datetime.datetime.now()

print("Time: {0}".format(e-b))
