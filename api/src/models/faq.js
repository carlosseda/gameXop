module.exports = function (sequelize, DataTypes) {
  const Faq = sequelize.define('Faq', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('createdAt')
          ? this.getDataValue('createdAt').toISOString().split('T')[0]
          : null;
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return this.getDataValue('updatedAt')
          ? this.getDataValue('updatedAt').toISOString().split('T')[0]
          : null;
      }
    }
  }, {
    sequelize,
    tableName: 'faqs',
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

  Faq.associate = function (models) {

  }

  return Faq
}
