module.exports = function (sequelize, DataTypes) {
  const SocialNetwork = sequelize.define('SocialNetwork', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    baseUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "url".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "url".'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('createdAt')
          ? this.getDataValue('createdAt').toISOString().split('T')[0]
          : null
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('updatedAt')
          ? this.getDataValue('updatedAt').toISOString().split('T')[0]
          : null
      }
    }
  }, {
    sequelize,
    tableName: 'social_networks',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      }
    ]
  })

  SocialNetwork.associate = function (models) {
    SocialNetwork.hasOne(models.Image, { as: 'images', foreignKey: 'entityId', scope: { entity: 'social_networks' } })
  }

  return SocialNetwork
}
