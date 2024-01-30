module.exports = function (sequelize, DataTypes) {
  const PageTracking = sequelize.define('PageTracking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fingerprintId: {
      type: DataTypes.INTEGER
    },
    localeSeoId: {
      type: DataTypes.INTEGER
    },
    localeSeoSlugId: {
      type: DataTypes.INTEGER
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isRobot: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    startTime: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    latencyMS: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
    tableName: 'page_trackings',
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
      },
      {
        name: 'page_trackings_customerId_fk',
        using: 'BTREE',
        fields: [
          { name: 'customerId' }
        ]
      },
      {
        name: 'page_trackings_fingerprintId_fk',
        using: 'BTREE',
        fields: [
          { name: 'fingerprintId' }
        ]
      },
      {
        name: 'page_trackings_localeSeoId_fk',
        using: 'BTREE',
        fields: [
          { name: 'localeSeoId' }
        ]
      },
      {
        name: 'page_trackings_localeSeoSlugId_fk',
        using: 'BTREE',
        fields: [
          { name: 'localeSeoSlugId' }
        ]
      }
    ]
  })

  PageTracking.associate = function (models) {
    PageTracking.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    PageTracking.belongsTo(models.Fingerprint, { as: 'fingerprint', foreignKey: 'fingerprintId' })
    PageTracking.belongsTo(models.LocaleSeo, { as: 'localeSeo', foreignKey: 'localeSeoId' })
    PageTracking.belongsTo(models.LocaleSeoSlug, { as: 'localeSeoSlug', foreignKey: 'localeSeoSlugId' })
  }

  return PageTracking
}
