<template>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">
        Informe os dados do seu Churras!
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">
        Quando vai ser?
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3">
        Contribuição para o Churras
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4">
        Convidar a Galera!
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="12">
              <v-text-field
                v-model="churrasco.descricao"
                maxlength="100"
                :error-messages="descricaoErrors"
                counter="100"
                label="Descrição"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="12">
              <v-textarea
                v-model="churrasco.observacoes"
                maxlength="500"
                counter="500"
                label="Observações"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <v-btn color="primary" @click="validaCampos(), (e1 = 2)">
          Continue
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-menu
              v-model="menuData"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateText"
                  label="Data"
                  prepend-icon="mdi-calendar"
                  :error-messages="dataErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="churrasco.data"
                type="date"
                locale="pt-br"
                :min="nowDate"
                @input="menuData = false"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="12" md="6">
            <v-menu
              ref="menuHorario"
              v-model="menuHorario"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="churrasco.horario"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="churrasco.horario"
                  label="Horário"
                  prepend-icon="mdi-clock-time-four-outline"
                  :error-messages="horarioErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuHorario"
                v-model="churrasco.horario"
                full-width
                format="24hr"
                @click:minute="$refs.menuHorario.save(churrasco.horario)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-btn color="primary" @click="validaCampos(), (e1 = 3)">
          Continue
        </v-btn>

        <v-btn text @click="e1 > 1 ? (e1 = e1 - 1) : 1">
          Voltar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <OpcoesComponent v-on:update-opcoes="updateOpcoes" class="mb-5" />

        <v-btn color="primary" @click="validaCampos(), (e1 = 4)">
          Continue
        </v-btn>

        <v-btn text @click="e1 > 1 ? (e1 = e1 - 1) : 1">
          Voltar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-combobox
          @change="addConvidado"
          label="Nome do Convidado"
          multiple
          persistent-hint
          hint="Digite o nome do convidado e aperte a tecla ENTER para adicionar"
          chips
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  Pressione <kbd>enter</kbd> para adicionar um convidado
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.slice(0, 1).toUpperCase()"
              ></v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>
        <v-btn color="primary" @click="salvar">
          Salvar
        </v-btn>

        <v-btn text @click="e1 > 1 ? (e1 = e1 - 1) : 1">
          Voltar
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
    <v-alert
    v-if="error && this.$v.$invalid"
      text
      prominent
      type="error"
      icon="mdi-cloud-alert"
    >
      Alguns campos necessitam de sua atenção... Por favor, volte e faça a correção.
    </v-alert>
  </v-stepper>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import OpcoesComponent from "./components/OpcoesComponent.vue";
export default {
  mixins: [validationMixin],
  validations: {
    churrasco: {
      descricao: { required },
      data: { required },
      horario: { required },
    },
  },
  components: {
    OpcoesComponent,
  },

  data() {
    return {
      e1: 1,
      error: false,
      dateText: null,
      menuData: false,
      menuHorario: false,
      nowDate: new Date().toISOString().slice(0, 10),
      churrasco: {
        data: null,
        descricao: "",
        observacoes: "",
        opcoes: [],
        convidados: [],
      },
    };
  },
  watch: {
    "churrasco.data"(val) {
      this.dateText = this.moment(val).format("DD/MM/YYYY");
    },
    "churrasco.horario"(val) {
      this.churrasco.data = this.moment(this.churrasco.data)
        .startOf("day")
        .add(val)
        .format("YYYY-MM-DD HH:mm");
    },
  },
  methods: {
    updateOpcoes(val) {
      this.churrasco.opcoes = val;
    },
    validaCampos() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return false;
      } else {
        return true;
      }
    },
    addConvidado(val) {
      if (val.length > 0) {
        this.churrasco.convidados = []
        val.forEach((element) => {
          this.churrasco.convidados.push({ nome: element });
        });
      }
    },
    salvar() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        this.error = true;
        return;
      }
      let self = this;
      this.$http.post("churrascos/", this.$qs.stringify(this.churrasco)).then(
        (response) => {
          this.$toast.success(
            response.data ? response.data : "Churrasco criado com sucesso!"
          );
          self.$router.push({ name: "churrascos" });
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
              "Não foi possível criar o churrasco, tente mais tarde.";
          }
          this.$toast.error(messageError);
        }
      );
    },
  },
  computed: {
    horarioErrors() {
      const errors = [];

      if (!this.$v.churrasco.horario.$dirty) return errors;
      !this.$v.churrasco.horario.required &&
        errors.push("É necessário selecionar um horário.");
      return errors;
    },
    dataErrors() {
      const errors = [];

      if (!this.$v.churrasco.data.$dirty) return errors;
      !this.$v.churrasco.data.required &&
        errors.push("É necessário selecionar uma data.");
      return errors;
    },
    descricaoErrors() {
      const errors = [];

      if (!this.$v.churrasco.descricao.$dirty) return errors;
      !this.$v.churrasco.descricao.required &&
        errors.push("A descricao é obrigatória");
      return errors;
    },
  },
};
</script>
