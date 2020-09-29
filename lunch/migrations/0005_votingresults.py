# Generated by Django 3.1.1 on 2020-09-25 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lunch', '0004_votingresults'),
    ]

    operations = [
        migrations.CreateModel(
            name='VotingResults',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('count_vote', models.IntegerField()),
                ('restaurant_id', models.IntegerField()),
            ],
            options={
                'db_table': 'voting_results',
                'managed': False,
            },
        ),
    ]