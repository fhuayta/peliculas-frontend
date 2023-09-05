/* eslint-disable */
import { $Casbin } from '@/plugins/casbin';

export default {
  methods: {
    $check: async (rol, resource, action) => {
      if ($Casbin && $Casbin.enforcer) {
        return $Casbin.enforcer
          .enforce(rol, resource, action)
          .then(permitido => {
            return permitido;
          });
      }
      return false;
    },
  },
};
