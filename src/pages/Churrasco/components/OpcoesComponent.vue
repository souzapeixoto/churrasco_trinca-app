<template>
  <v-card>
    <v-toolbar color="primary" dark>Opções de Contribuição</v-toolbar>
    <v-card-text>
      <v-data-table :headers="headers" :items="opcoes" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Exemplo: Com bebida, Sem bebida...</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nova Opção
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.descricao"
                          label="Descrição"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        Valor que será cobrado
                        <money  v-model="editedItem.valor" v-bind="money"></money> 
                      </v-col>
                      <v-col cols="12" sm="6" md="4"> </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Tem certeza que deseja excluir esta opção?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.valor="{ item }">
          R$ {{ formatPrice(item.valor) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import { Money } from "v-money";
export default {
  components: { Money },
  data: () => ({
    dialog: false,
    money: {
      decimal: ",",
      thousands: ".",
      prefix: "R$ ",
      suffix: "",
      precision: 2,
      masked: false,
    },

    dialogDelete: false,
    headers: [
      {
        text: "Descrição",
        align: "start",
        sortable: false,
        value: "descricao",
      },
      { text: "Valor que será cobrado", value: "valor" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    opcoes: [],

    editedIndex: -1,
    editedItem: {
      descricao: "",
      valor: 0,
    },

    defaultItem: {
      descricao: "",
      valor: 0,
    },
  }),

  props: {
    items: {
      required: false,
    },
    updateDatabase: {
      require: true,
    },
    idChurrasco: {
      require: true,
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Adicionar Opção" : "Editar Opção";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    items() {
      this.opcoes = this.items;
    },
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.opcoes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.opcoes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      if (this.updateDatabase) {
        this.delete();
      } else {
        this.opcoes.splice(this.editedIndex, 1);
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        if (this.updateDatabase) {
          this.update();
        } else {
          Object.assign(self.opcoes[self.editedIndex], self.editedItem);
          this.close();
        }
      } else {
        if (this.updateDatabase) {
          this.insert();
        } else {
          this.opcoes.push(this.editedItem);
          this.$emit("update-opcoes", this.opcoes);
          this.close();
        }
      }
    },

    insert() {
      let self = this;
      this.$http
        .post(
          `churrascos/${this.idChurrasco}/opcoes`,
          this.$qs.stringify(this.editedItem)
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data ? response.data : "Opcao criada com sucesso!"
            );
            this.opcoes.push(this.editedItem);
            this.close();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível criar a Opção, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },

    update() {
      let self = this;
      this.$http
        .put(
          `churrascos/${this.editedItem.idChurrasco}/opcoes/${this.editedItem.id}`,
          this.$qs.stringify(this.editedItem)
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data ? response.data : "Opção atualizada com sucesso!"
            );

            //self.$router.push({ name: "churrascos" });
            Object.assign(self.opcoes[self.editedIndex], self.editedItem);
            this.close();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível atializar a Opção, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },
    delete() {
      let self = this;
      this.$http
        .delete(
          `churrascos/${this.editedItem.idChurrasco}/opcoes/${this.editedItem.id}`
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data ? response.data : "Opção ecluído com sucesso!"
            );

            //self.$router.push({ name: "churrascos" });
            this.opcoes.splice(this.editedIndex, 1);
            this.closeDelete();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível excluir a Opção, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
};
</script>
