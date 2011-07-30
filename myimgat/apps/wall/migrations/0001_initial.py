# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Album'
        db.create_table('wall_album', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('identifier', self.gf('django.db.models.fields.CharField')(max_length=200, db_index=True)),
            ('url', self.gf('django.db.models.fields.CharField')(db_index=True, max_length=500, null=True, blank=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal('wall', ['Album'])

        # Adding model 'Photo'
        db.create_table('wall_photo', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('url', self.gf('django.db.models.fields.CharField')(max_length=500, db_index=True)),
            ('thumbnail', self.gf('django.db.models.fields.CharField')(max_length=500, db_index=True)),
            ('album', self.gf('django.db.models.fields.related.ForeignKey')(related_name='photos', to=orm['wall.Album'])),
        ))
        db.send_create_signal('wall', ['Photo'])


    def backwards(self, orm):
        
        # Deleting model 'Album'
        db.delete_table('wall_album')

        # Deleting model 'Photo'
        db.delete_table('wall_photo')


    models = {
        'wall.album': {
            'Meta': {'object_name': 'Album'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'identifier': ('django.db.models.fields.CharField', [], {'max_length': '200', 'db_index': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'db_index': 'True', 'max_length': '500', 'null': 'True', 'blank': 'True'})
        },
        'wall.photo': {
            'Meta': {'object_name': 'Photo'},
            'album': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'photos'", 'to': "orm['wall.Album']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'thumbnail': ('django.db.models.fields.CharField', [], {'max_length': '500', 'db_index': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '500', 'db_index': 'True'})
        }
    }

    complete_apps = ['wall']
